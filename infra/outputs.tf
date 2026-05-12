output "cloudfront_url" {
  description = "URL pública da aplicação"
  value       = "https://${var.domain}"
}

output "cloudfront_distribution_id" {
  description = "ID da distribuição CloudFront — necessário para o GitHub Actions"
  value       = aws_cloudfront_distribution.app.id
}

output "s3_bucket_name" {
  description = "Nome do bucket S3 — necessário para o GitHub Actions"
  value       = aws_s3_bucket.app.bucket
}
