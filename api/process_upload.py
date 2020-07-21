import json
import uuid
import boto3
import os
import urllib.parse

# Get the service client.
s3 = boto3.client('s3', region_name='us-west-2')
#PICTURE_BUCKET = os.environ['PICTURE_BUCKET']
PICTURE_BUCKET = 'picminder.aleonard.dev.pictures'
headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,GET"
}

def handler(event, context):
    # Get the object from the event
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')

    s3_object = s3.get_object(Bucket=bucket, Key=key)
    new_key = 'output_{}'.format(key) # TODO: 'output_{}'.format(key.split('_'[1]))
    #s3.upload_fileobj(json.dumps(event, indent=2), PICTURE_BUCKET, 'test_event')
    s3.put_object(Body=s3_object, Bucket=PICTURE_BUCKET, Key='test_event')
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'NewKey': new_key})
    }
