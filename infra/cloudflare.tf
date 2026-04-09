provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

data "cloudflare_zone" "domain" {
  name = var.cloudflare_zone
}

# DNS record for backend API domain
resource "cloudflare_record" "api_dns" {
  zone_id = data.cloudflare_zone.domain.id
  name    = var.domain_name
  content = aws_lb.floragest_alb.dns_name
  type    = "CNAME"
  ttl     = 300
  proxied = false  # Set to true if you want Cloudflare proxy
}

# DNS record for frontend domain
resource "cloudflare_record" "frontend_dns" {
  zone_id = data.cloudflare_zone.domain.id
  name    = var.frontend_domain_name
  content = aws_lb.floragest_frontend_alb.dns_name
  type    = "CNAME"
  ttl     = 300
  proxied = false  # Set to true if you want Cloudflare proxy
}