variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "sa-east-1" # Example default, change as needed
}

variable "db_instance_class" {
  description = "The instance type for the RDS PostgreSQL database."
  type        = string
  default     = "db.t3.micro" # Example default, choose based on your needs
}

variable "db_allocated_storage" {
  description = "The allocated storage in GB for the RDS PostgreSQL database."
  type        = number
  default     = 20 # Example default
}

variable "db_max_allocated_storage" {
  description = "The maximum allocated storage in GB for the RDS PostgreSQL database."
  type        = number
  default     = 100 # Example default
}

variable "db_master_username" {
  description = "The master username for the RDS PostgreSQL database."
  type        = string
  default     = "floragestmaster" # Example default
}

variable "db_app_username" {
  description = "The application username for the RDS PostgreSQL database."
  type        = string
  default     = "floragestapp" # Example default
}

variable "skip_final_snapshot" {
  description = "Determines whether a final DB snapshot is created before the DB instance is deleted."
  type        = bool
  default     = true # Set to 'false' for production to retain a final snapshot
}

# EC2 Variables
variable "ec2_instance_type" {
  description = "EC2 instance type for the backend"
  type        = string
  default     = "t3.micro"
}

variable "ec2_volume_size" {
  description = "Root volume size in GB for EC2 instance"
  type        = number
  default     = 20
}

variable "docker_image" {
  description = "Docker image URI for the backend application"
  type        = string
  default     = "your-account-id.dkr.ecr.sa-east-1.amazonaws.com/floragest-backend:latest"
}

variable "ssh_public_key" {
  description = "SSH public key for EC2 access"
  type        = string
  default     = ""
}

variable "ssh_allowed_cidr_blocks" {
  description = "CIDR blocks allowed for SSH access"
  type        = list(string)
  default     = ["0.0.0.0/0"]  # Restrict this in production
}

# ECS Variables
variable "ecs_cpu" {
  description = "CPU units for ECS task (256, 512, 1024, 2048, 4096)"
  type        = number
  default     = 256
}

variable "ecs_memory" {
  description = "Memory for ECS task in MB (512, 1024, 2048, 4096, 8192)"
  type        = number
  default     = 512
}

variable "ecs_desired_count" {
  description = "Number of tasks to run"
  type        = number
  default     = 1
}

variable "environment" {
  description = "Environment (DEV or PROD)"
  type        = string
  default     = "PROD"
}

variable "debug_mode" {
  description = "Enable debug mode"
  type        = bool
  default     = false
}

variable "log_level" {
  description = "Logging level"
  type        = string
  default     = "INFO"
}

variable "db_app_password" {
  description = "Password for the floragest user"
  type        = string
  sensitive   = true
  default     = "backend-jera"
}

variable "domain_name" {
  description = "The custom domain name for the API (e.g., api.example.com)."
  type        = string
}

variable "cloudflare_zone" {
  description = "The root domain managed in Cloudflare (e.g., liander.dev)."
  type        = string
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token with permissions to edit DNS."
  type        = string
  sensitive   = true
}

# Frontend Variables
variable "frontend_docker_image" {
  description = "Docker image URI for the frontend application"
  type        = string
  default     = "your-account-id.dkr.ecr.sa-east-1.amazonaws.com/floragest-frontend:latest"
}

variable "frontend_domain_name" {
  description = "The custom domain name for the frontend (e.g., floragest.liander.dev)."
  type        = string
}

variable "frontend_ecs_cpu" {
  description = "CPU units for frontend ECS task (256, 512, 1024, 2048, 4096)"
  type        = number
  default     = 256
}

variable "frontend_ecs_memory" {
  description = "Memory for frontend ECS task in MB (512, 1024, 2048, 4096, 8192)"
  type        = number
  default     = 512
}

variable "frontend_ecs_desired_count" {
  description = "Number of frontend tasks to run"
  type        = number
  default     = 1
}