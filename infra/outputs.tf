output "counter_url" {
  description = "Full URL the frontend POSTs to"
  value       = "${aws_apigatewayv2_api.visitor_api.api_endpoint}/count"
}

output "site_bucket_name" {
  value = aws_s3_bucket.site.id
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.site.id
}

output "frontend_deploy_role_arn" {
  value = aws_iam_role.github_frontend_deploy.arn
}

output "cloudfront_domain_name" {
  description = "Public URL of the site"
  value       = aws_cloudfront_distribution.site.domain_name
}
