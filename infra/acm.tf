resource "aws_acm_certificate" "cert" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "floragest-cert"
  }
}

resource "cloudflare_record" "cert_validation_record" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      value  = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = data.cloudflare_zone.domain.id
  name    = each.value.name
  content = each.value.value
  type    = each.value.type
  ttl     = 60
  proxied = false # IMPORTANT: Validation records must not be proxied
}

resource "aws_acm_certificate_validation" "cert_validation" {
  certificate_arn = aws_acm_certificate.cert.arn
  validation_record_fqdns = [
    for record in cloudflare_record.cert_validation_record : record.hostname
  ]
}

# Frontend ACM Certificate
resource "aws_acm_certificate" "frontend_cert" {
  domain_name       = var.frontend_domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "floragest-frontend-cert"
  }
}

resource "cloudflare_record" "frontend_cert_validation_record" {
  for_each = {
    for dvo in aws_acm_certificate.frontend_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      value  = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = data.cloudflare_zone.domain.id
  name    = each.value.name
  content = each.value.value
  type    = each.value.type
  ttl     = 60
  proxied = false # IMPORTANT: Validation records must not be proxied
}

resource "aws_acm_certificate_validation" "frontend_cert_validation" {
  certificate_arn = aws_acm_certificate.frontend_cert.arn
  validation_record_fqdns = [
    for record in cloudflare_record.frontend_cert_validation_record : record.hostname
  ]
}
