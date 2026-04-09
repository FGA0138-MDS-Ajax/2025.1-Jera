output "vpc_id" {
  description = "The ID of the created VPC."
  value       = aws_vpc.floragest_vpc.id
}

output "rds_endpoint" {
  description = "The endpoint address of the RDS PostgreSQL instance."
  value       = aws_db_instance.floragest_postgres.address
}

output "rds_port" {
  description = "The port of the RDS PostgreSQL instance."
  value       = aws_db_instance.floragest_postgres.port
}

output "master_secret_arn" {
  description = "The ARN of the AWS Secrets Manager secret for master credentials."
  value       = aws_secretsmanager_secret.db_cred_master.arn
}

output "app_secret_arn" {
  description = "The ARN of the AWS Secrets Manager secret for application credentials."
  value       = aws_secretsmanager_secret.db_cred_app.arn
}

# ECS Outputs
output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.floragest_alb.dns_name
}

output "backend_api_url" {
  description = "URL to access the backend API"
  value       = "https://${var.domain_name}"
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.floragest_cluster.name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = aws_ecs_service.floragest_backend.name
}

# ECR Outputs
output "ecr_repository_url" {
  description = "URL of the ECR repository for the backend"
  value       = aws_ecr_repository.floragest_backend.repository_url
}

# Frontend Outputs
output "frontend_alb_dns_name" {
  description = "DNS name of the Frontend Application Load Balancer"
  value       = aws_lb.floragest_frontend_alb.dns_name
}

output "frontend_url" {
  description = "URL to access the frontend application"
  value       = "https://${var.frontend_domain_name}"
}

output "frontend_ecs_service_name" {
  description = "Name of the Frontend ECS service"
  value       = aws_ecs_service.floragest_frontend.name
}

# Frontend ECR Output
output "frontend_ecr_repository_url" {
  description = "URL of the ECR repository for the frontend"
  value       = aws_ecr_repository.floragest_frontend.repository_url
}

# alb_dns_name = "floragest-alb-1445168795.sa-east-1.elb.amazonaws.com"
# app_secret_arn = "arn:aws:secretsmanager:sa-east-1:965134913902:secret:floragest/db/app-sa-east-1-JVRUrS"
# backend_api_url = "https://api.floragest.liander.dev"
# ecr_repository_url = "965134913902.dkr.ecr.sa-east-1.amazonaws.com/floragest-backend"
# ecs_cluster_name = "floragest-cluster"
# ecs_service_name = "floragest-backend-service"
# master_secret_arn = "arn:aws:secretsmanager:sa-east-1:965134913902:secret:floragest/db/master-sa-east-1-pt7asd"
# rds_endpoint = "floragest-postgres.cg0xm64hbsqi.sa-east-1.rds.amazonaws.com"
# rds_port = 5432
# vpc_id = "vpc-0ff50e79be3615799"