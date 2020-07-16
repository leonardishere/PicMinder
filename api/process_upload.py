import json
import uuid
import boto3
import os

# Get the service client.
s3 = boto3.client('s3', region_name='us-west-2')
PICTURE_BUCKET = os.environ['PICTURE_BUCKET']

def handler(event, context):
    print(event)
    print(json.dumps(event, indent=2))
    s3.upload_fileobj(json.dumps(event, indent=2), PICTURE_BUCKET, 'test_event')
