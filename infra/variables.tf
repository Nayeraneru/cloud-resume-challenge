variable "aws_region" {
  description = "AWS region for most resources. CloudFront itself is global, but ACM certs used by CloudFront must be requested in us-east-1 — keep that in mind if you add a custom domain later."
  type        = string
  default     = "eu-central-1"
}

variable "project_name" {
  description = "Short name used as a prefix/tag for every resource, so you can find and tear down everything belonging to this project."
  type        = string
  default     = "cloud-resume"
}

variable "dynamodb_table_name" {
  description = "Name of the DynamoDB table storing the visitor counter."
  type        = string
  default     = "cloud-resume-visitor-counter"
}

variable "github_repo" {
  description = "GitHub repo allowed to deploy, as Nayeraner/cloud-resume-challenge"
  type        = string
}
