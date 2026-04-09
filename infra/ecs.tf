# ECS Infrastructure for Floragest Backend

# ECS Cluster
resource "aws_ecs_cluster" "floragest_cluster" {
  name = "floragest-cluster"

  configuration {
    execute_command_configuration {
      logging = "OVERRIDE"
      log_configuration {
        cloud_watch_log_group_name = aws_cloudwatch_log_group.ecs_logs.name
      }
    }
  }

  tags = {
    Name = "floragest-cluster"
  }
}

# CloudWatch Log Group for ECS
resource "aws_cloudwatch_log_group" "ecs_logs" {
  name              = "/ecs/floragest-backend"
  retention_in_days = 7

  tags = {
    Name = "floragest-ecs-logs"
  }
}

# Security Group for ALB
resource "aws_security_group" "floragest_alb_sg" {
  name_prefix = "floragest-alb-"
  vpc_id      = aws_vpc.floragest_vpc.id

  # HTTP access
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS access
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # All outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "floragest-alb-sg"
  }
}

# Security Group for ECS Tasks
resource "aws_security_group" "floragest_ecs_sg" {
  name_prefix = "floragest-ecs-"
  vpc_id      = aws_vpc.floragest_vpc.id

  # HTTP access from ALB
  ingress {
    from_port       = 8000
    to_port         = 8000
    protocol        = "tcp"
    security_groups = [aws_security_group.floragest_alb_sg.id]
  }

  # All outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "floragest-ecs-sg"
  }
}

# Application Load Balancer
resource "aws_lb" "floragest_alb" {
  name               = "floragest-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.floragest_alb_sg.id]
  subnets           = [aws_subnet.floragest_subnet_1.id, aws_subnet.floragest_subnet_2.id]

  enable_deletion_protection = false

  tags = {
    Name = "floragest-alb"
  }
}

# ALB Target Group
resource "aws_lb_target_group" "floragest_tg" {
  name        = "floragest-tg"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.floragest_vpc.id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }

  tags = {
    Name = "floragest-tg"
  }
}

# Listener for HTTP (port 80) that redirects to HTTPS
resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.floragest_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# Listener for HTTPS (port 443)
resource "aws_lb_listener" "https_listener" {
  load_balancer_arn = aws_lb.floragest_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = aws_acm_certificate_validation.cert_validation.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.floragest_tg.arn
  }
}

# IAM role for ECS Task Execution
resource "aws_iam_role" "floragest_ecs_execution_role" {
  name = "floragest-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "floragest-ecs-execution-role"
  }
}

# IAM role for ECS Task
resource "aws_iam_role" "floragest_ecs_task_role" {
  name = "floragest-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "floragest-ecs-task-role"
  }
}

# IAM policy for accessing Secrets Manager
resource "aws_iam_policy" "floragest_secrets_policy" {
  name = "floragest-secrets-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = [
          aws_secretsmanager_secret.db_cred_app.arn,
          aws_secretsmanager_secret.db_cred_master.arn
        ]
      }
    ]
  })
}

# Attach AWS managed policy for ECS task execution
resource "aws_iam_role_policy_attachment" "floragest_ecs_execution_policy" {
  role       = aws_iam_role.floragest_ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Attach Secrets Manager policy to execution role (ADD THIS)
resource "aws_iam_role_policy_attachment" "floragest_secrets_execution_attach" {
  role       = aws_iam_role.floragest_ecs_execution_role.name
  policy_arn = aws_iam_policy.floragest_secrets_policy.arn
}

# Attach Secrets Manager policy to task role (ADD THIS)
resource "aws_iam_role_policy_attachment" "floragest_secrets_task_attach" {
  role       = aws_iam_role.floragest_ecs_task_role.name
  policy_arn = aws_iam_policy.floragest_secrets_policy.arn
}

# ECS Task Definition
resource "aws_ecs_task_definition" "floragest_backend" {
  family                   = "floragest-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.ecs_cpu
  memory                   = var.ecs_memory
  execution_role_arn       = aws_iam_role.floragest_ecs_execution_role.arn
  task_role_arn           = aws_iam_role.floragest_ecs_task_role.arn

  # Add depends_on to ensure policies are attached first
  depends_on = [
    aws_iam_role_policy_attachment.floragest_ecs_execution_policy,
    aws_iam_role_policy_attachment.floragest_secrets_execution_attach,
    aws_iam_role_policy_attachment.floragest_secrets_task_attach,
    aws_cloudwatch_log_group.ecs_logs
  ]

  container_definitions = jsonencode([
    {
      name  = "floragest-backend"
      image = var.docker_image
      
      portMappings = [
        {
          containerPort = 8000
          protocol      = "tcp"
        }
      ]
      
      environment = [
        {
          name  = "AWS_REGION"
          value = var.aws_region
        },
        # Database configuration - these will be overridden by secrets
        {
          name  = "DB_VENDOR"
          value = "POSTGRES"
        },
        {
          name  = "DB_PORT"
          value = "5432"
        },
        {
          name  = "DB_SCHEMA"
          value = "app"
        },
        # Application environment
        {
          name  = "ENVIRONMENT"
          value = "DEV"
        },
        {
          name  = "DEBUG"
          value = "True"
        },
        {
          name  = "TESTING"
          value = "False"
        },
        # Logging configuration
        {
          name  = "LOG_DIR"
          value = "/tmp/logs"
        },
        {
          name  = "LOG_FILE"
          value = "app.log"
        },
        {
          name  = "LOG_MAX_BYTES"
          value = "10000000"
        },
        {
          name  = "LOG_BACKUP_COUNT"
          value = "5"
        },
        {
          name  = "DISABLE_EXISTING_LOGGERS"
          value = "False"
        }
      ]
      
      secrets = [
        {
          name      = "DB_HOST"
          valueFrom = "${aws_secretsmanager_secret.db_cred_master.arn}:endpoint::"
        },
        {
          name      = "DB_USER"
          valueFrom = "${aws_secretsmanager_secret.db_cred_master.arn}:username::"
        },
        {
          name      = "DB_PASS"
          valueFrom = "${aws_secretsmanager_secret.db_cred_master.arn}:password::"
        },
        {
          name      = "DB_NAME"
          valueFrom = "${aws_secretsmanager_secret.db_cred_master.arn}:dbname::"
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs_logs.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
      
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:8000/docs || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
      
      essential = true
    }
  ])

  tags = {
    Name = "floragest-backend-task"
  }
}

# ECS Service
resource "aws_ecs_service" "floragest_backend" {
  name            = "floragest-backend-service"
  cluster         = aws_ecs_cluster.floragest_cluster.id
  task_definition = aws_ecs_task_definition.floragest_backend.arn
  desired_count   = var.ecs_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.floragest_ecs_sg.id]
    subnets         = [aws_subnet.floragest_subnet_1.id, aws_subnet.floragest_subnet_2.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.floragest_tg.arn
    container_name   = "floragest-backend"
    container_port   = 8000
  }

  depends_on = [aws_lb_listener.https_listener]

  tags = {
    Name = "floragest-backend-service"
  }
}

# Frontend Infrastructure

# Security Group for Frontend ALB
resource "aws_security_group" "floragest_frontend_alb_sg" {
  name_prefix = "floragest-frontend-alb-"
  vpc_id      = aws_vpc.floragest_vpc.id

  # HTTP access
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS access
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # All outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "floragest-frontend-alb-sg"
  }
}

# Security Group for Frontend ECS Tasks
resource "aws_security_group" "floragest_frontend_ecs_sg" {
  name_prefix = "floragest-frontend-ecs-"
  vpc_id      = aws_vpc.floragest_vpc.id

  # HTTP access from ALB
  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.floragest_frontend_alb_sg.id]
  }

  # All outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "floragest-frontend-ecs-sg"
  }
}

# Frontend Application Load Balancer
resource "aws_lb" "floragest_frontend_alb" {
  name               = "floragest-frontend-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.floragest_frontend_alb_sg.id]
  subnets           = [aws_subnet.floragest_subnet_1.id, aws_subnet.floragest_subnet_2.id]

  enable_deletion_protection = false

  tags = {
    Name = "floragest-frontend-alb"
  }
}

# Frontend ALB Target Group
resource "aws_lb_target_group" "floragest_frontend_tg" {
  name        = "floragest-frontend-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.floragest_vpc.id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }

  tags = {
    Name = "floragest-frontend-tg"
  }
}

# Frontend Listener for HTTP (port 80) that redirects to HTTPS
resource "aws_lb_listener" "frontend_http_listener" {
  load_balancer_arn = aws_lb.floragest_frontend_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# Frontend Listener for HTTPS (port 443)
resource "aws_lb_listener" "frontend_https_listener" {
  load_balancer_arn = aws_lb.floragest_frontend_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = aws_acm_certificate_validation.frontend_cert_validation.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.floragest_frontend_tg.arn
  }
}

# CloudWatch Log Group for Frontend ECS
resource "aws_cloudwatch_log_group" "frontend_ecs_logs" {
  name              = "/ecs/floragest-frontend"
  retention_in_days = 7

  tags = {
    Name = "floragest-frontend-ecs-logs"
  }
}

# Frontend ECS Task Definition
resource "aws_ecs_task_definition" "floragest_frontend" {
  family                   = "floragest-frontend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.frontend_ecs_cpu
  memory                   = var.frontend_ecs_memory
  execution_role_arn       = aws_iam_role.floragest_ecs_execution_role.arn
  task_role_arn           = aws_iam_role.floragest_ecs_task_role.arn

  depends_on = [
    aws_iam_role_policy_attachment.floragest_ecs_execution_policy,
    aws_cloudwatch_log_group.frontend_ecs_logs
  ]

  container_definitions = jsonencode([
    {
      name  = "floragest-frontend"
      image = var.frontend_docker_image
      
      portMappings = [
        {
          containerPort = 80
          protocol      = "tcp"
        }
      ]
      
      environment = [
        {
          name  = "BACKEND_URL"
          value = "https://${var.domain_name}"
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.frontend_ecs_logs.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
      
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:80/ || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
      
      essential = true
    }
  ])

  tags = {
    Name = "floragest-frontend-task"
  }
}

# Frontend ECS Service
resource "aws_ecs_service" "floragest_frontend" {
  name            = "floragest-frontend-service"
  cluster         = aws_ecs_cluster.floragest_cluster.id
  task_definition = aws_ecs_task_definition.floragest_frontend.arn
  desired_count   = var.frontend_ecs_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.floragest_frontend_ecs_sg.id]
    subnets         = [aws_subnet.floragest_subnet_1.id, aws_subnet.floragest_subnet_2.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.floragest_frontend_tg.arn
    container_name   = "floragest-frontend"
    container_port   = 80
  }

  depends_on = [aws_lb_listener.frontend_https_listener]

  tags = {
    Name = "floragest-frontend-service"
  }
}
