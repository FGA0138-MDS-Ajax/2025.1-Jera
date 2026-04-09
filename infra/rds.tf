# main.tf

# Define required providers and their versions
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0" # Ensure you have the latest 5.x version for best compatibility.
                        # Run 'opentofu init -upgrade' after updating this version.
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

# Configure the AWS provider
provider "aws" {
  region = var.aws_region
}

# Data source to get available availability zones in the specified region
# This makes the subnet creation more robust and less dependent on hardcoded AZ names.
data "aws_availability_zones" "available" {
  state = "available"
  # Filter by region name if you want to be explicit, though it defaults to the provider's region.
  # filter {
  #   name   = "region-name"
  #   values = [var.aws_region]
  # }
}

# VPC and networking resources
resource "aws_vpc" "floragest_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true # Allows EC2 instances in the VPC to get public DNS hostnames.
  enable_dns_support   = true # Enables DNS resolution within the VPC.

  tags = {
    Name = "floragest-vpc"
  }
}

# Subnet 1 in the first available AZ
resource "aws_subnet" "floragest_subnet_1" {
  vpc_id            = aws_vpc.floragest_vpc.id
  cidr_block        = "10.0.1.0/24"
  # Dynamically select the first available AZ
  availability_zone = data.aws_availability_zones.available.names[0]

  tags = {
    Name = "floragest-subnet-1"
  }
}

# Subnet 2 in the second available AZ
resource "aws_subnet" "floragest_subnet_2" {
  vpc_id            = aws_vpc.floragest_vpc.id
  cidr_block        = "10.0.2.0/24"
  # Dynamically select the second available AZ
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    Name = "floragest-subnet-2"
  }
}

# Internet Gateway for the VPC
resource "aws_internet_gateway" "floragest_igw" {
  vpc_id = aws_vpc.floragest_vpc.id

  tags = {
    Name = "floragest-igw"
  }
}

# Route Table to allow outbound internet access
resource "aws_route_table" "floragest_rt" {
  vpc_id = aws_vpc.floragest_vpc.id

  route {
    cidr_block = "0.0.0.0/0" # Default route for all outbound traffic
    gateway_id = aws_internet_gateway.floragest_igw.id
  }

  tags = {
    Name = "floragest-rt"
  }
}

# Associate Subnet 1 with the Route Table
resource "aws_route_table_association" "floragest_rta_1" {
  subnet_id      = aws_subnet.floragest_subnet_1.id
  route_table_id = aws_route_table.floragest_rt.id
}

# Associate Subnet 2 with the Route Table
resource "aws_route_table_association" "floragest_rta_2" {
  subnet_id      = aws_subnet.floragest_subnet_2.id
  route_table_id = aws_route_table.floragest_rt.id
}


# Security Group for RDS
resource "aws_security_group" "floragest_rds_sg" {
  name_prefix = "floragest-rds-"
  vpc_id      = aws_vpc.floragest_vpc.id

  ingress {
    from_port   = 5432 # PostgreSQL default port
    to_port     = 5432
    protocol    = "tcp"
    # WARNING: Allowing 0.0.0.0/0 for ingress to RDS is a major security risk.
    # This makes your database publicly accessible from anywhere on the internet.
    # For production environments, restrict this to specific IP ranges (e.g., your office IP,
    # or the CIDR block of your application servers' security group).
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0      # All ports
    to_port     = 0      # All ports
    protocol    = "-1"   # All protocols
    cidr_blocks = ["0.0.0.0/0"] # Allow all outbound traffic
  }

  tags = {
    Name = "floragest-rds-sg"
  }
}

# DB Subnet Group for RDS
# This group specifies the subnets where your RDS instance can be deployed.
resource "aws_db_subnet_group" "floragest_db_subnet_group" {
  name       = "floragest-db-subnet-group"
  subnet_ids = [aws_subnet.floragest_subnet_1.id, aws_subnet.floragest_subnet_2.id]

  tags = {
    Name = "floragest-db-subnet-group"
  }
}

# Generate random password for the master user
resource "random_password" "master_password" {
  length  = 16
  special = true
  min_special = 1
  # Exclude the forbidden characters: '/', '@', '"', ' '
  # The regex "[^/@\" ]" means "any character NOT in this set: /, @, ", space"
  override_special = "!#$%&'()*+,-.:;<=>?[\\]^_`{|}~"
}

# Generate random password for the application user
resource "random_password" "app_user_password" {
  length  = 16
  special = true
  min_special = 1
  # Exclude the forbidden characters: '/', '@', '"', ' '
  # The regex "[^/@\" ]" means "any character NOT in this set: /, @, ", space"
  override_special = "!#$%&'()*+,-.:;<=>?[\\]^_`{|}~"
}

# RDS PostgreSQL Instance
resource "aws_db_instance" "floragest_postgres" {
  identifier                = "floragest-postgres"
  engine                    = "postgres"
  # IMPORTANT: PostgreSQL 17.x is likely not yet generally available on AWS RDS.
  # Changed to 16.3, which is a stable, supported version.
  engine_version            = "16.8"
  instance_class            = var.db_instance_class
  allocated_storage         = var.db_allocated_storage
  max_allocated_storage     = var.db_max_allocated_storage
  storage_type              = "gp3" # General Purpose SSD (gp3) for better performance and cost control
  storage_encrypted         = true # Always encrypt your database storage

  db_name  = "floragest"
  username = var.db_master_username
  password = random_password.master_password.result # Use the generated master password

  vpc_security_group_ids = [aws_security_group.floragest_rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.floragest_db_subnet_group.name

  # WARNING: 'publicly_accessible = true' combined with the open security group
  # exposes your database to the internet. For most applications, set this to 'false'
  # and access the database from EC2 instances within the same VPC (private subnets).
  publicly_accessible = true
  skip_final_snapshot = var.skip_final_snapshot # Set to 'false' for production to retain a final snapshot on deletion

  backup_retention_period = 7 # Retain backups for 7 days
  # Note: Backup and maintenance windows are in UTC. Adjust based on your desired UTC time.
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  tags = {
    Name   = "floragest-postgres"
    Region = var.aws_region # Use the variable for region consistency
  }
}

# Store master database credentials in AWS Secrets Manager
resource "aws_secretsmanager_secret" "db_cred_master" {
  name = "floragest/db/master-${var.aws_region}" # Use variable for region in name
  # Explicitly set these default attributes to avoid potential "non-computed" warnings
  # with certain provider versions or legacy SDKs.
  recovery_window_in_days = 30
  force_overwrite_replica_secret = false # Only relevant if 'replica' block is used
  # The warning ".replica: attribute representing nested block must not be unknown itself"
  # often appears with legacy provider SDKs even when no 'replica' block is defined.
  # This is usually a planning artifact and indicates the need for an updated AWS provider.

  tags = {
    Region = var.aws_region
  }
}

# Store the version of the master secret
resource "aws_secretsmanager_secret_version" "db_cred_master" {
  secret_id = aws_secretsmanager_secret.db_cred_master.id
  secret_string = jsonencode({
    username     = var.db_master_username
    password     = random_password.master_password.result
    endpoint     = aws_db_instance.floragest_postgres.address
    port         = aws_db_instance.floragest_postgres.port
    dbname       = aws_db_instance.floragest_postgres.db_name
  })
}

# Store application database credentials in AWS Secrets Manager
resource "aws_secretsmanager_secret" "db_cred_app" {
  name = "floragest/db/app-${var.aws_region}" # Use variable for region in name
  # Explicitly set these default attributes for consistency.
  recovery_window_in_days = 30
  force_overwrite_replica_secret = false
  # The warning ".replica: attribute representing nested block must not be unknown itself"
  # often appears with legacy provider SDKs even when no 'replica' block is defined.
  # This is usually a planning artifact and indicates the need for an updated AWS provider.

  tags = {
    Region = var.aws_region
  }
}

# Store the version of the application secret
resource "aws_secretsmanager_secret_version" "db_cred_app" {
  secret_id = aws_secretsmanager_secret.db_cred_app.id
  secret_string = jsonencode({
    username = var.db_app_username
    password = var.db_app_password
    endpoint = aws_db_instance.floragest_postgres.address
    port     = aws_db_instance.floragest_postgres.port
    dbname   = aws_db_instance.floragest_postgres.db_name
  })
}
