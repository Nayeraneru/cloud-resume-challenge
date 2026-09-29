import json
import os
import boto3
from botocore.exceptions import ClientError

TABLE_NAME = os.environ["TABLE_NAME"]

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    headers = {
        "Content-Type": "application/json"
    }
    try:
        response = table.update_item(
            Key={"id": "counter"},
            UpdateExpression="ADD #v :inc",
            ExpressionAttributeNames={"#v": "views"},
            ExpressionAttributeValues={":inc": 1},
            ReturnValues="UPDATED_NEW",
        )
        views = response["Attributes"]["views"]
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"count": int(views)})}
    except ClientError as e:
        print(f"DynamoDB error: {e}")
        return {"statusCode": 500, "headers": headers, "body": json.dumps({"error": "Could not update counter"})}
