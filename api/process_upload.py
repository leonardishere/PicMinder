import json
import uuid
import boto3
import os
import urllib.parse

# Get the service client.
s3 = boto3.client('s3', region_name='us-west-2')
#PICTURE_BUCKET = os.environ['PICTURE_BUCKET']
PICTURE_BUCKET = 'picminder.aleonard.dev.pictures'

def handler(event, context):
    print(event)
    print(json.dumps(event, indent=2))
    s3.upload_fileobj(json.dumps(event, indent=2), PICTURE_BUCKET, 'test_event')

    # Get the object from the event and show its content type
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        print("CONTENT TYPE: " + response['ContentType'])
        return response['ContentType']
    except Exception as e:
        print(e)
        print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
        raise e
