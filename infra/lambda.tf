data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  output_path = "${path.module}/build/counter.zip"
}

resource "aws_lambda_function" "visitor_counter" {
  function_name    = "${var.project_name}-visitor-counter"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "counter.lambda_handler"
  runtime          = "python3.12"
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  timeout          = 5

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.visitor_counter.name
    }
  }
}
