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
    try:
        print(event)
        print(json.dumps(event, indent=2))
        #s3.upload_fileobj(json.dumps(event, indent=2), PICTURE_BUCKET, 'test_event')
        s3.put_object(Body=json.dumps(event, indent=2), Bucket=PICTURE_BUCKET, Key='test_event')
    except Exception as e:
        print(e)
        print('Error putting object')
        #raise e
        return {
            'statusCode': 500,
            'headers': headers,
            'body': str(e)
        }

    # Get the object from the event and show its content type
    try:
        bucket = event['Records'][0]['s3']['bucket']['name']
        key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    except Exception as e:
        print(e)
        print('Error getting bucket and key from event')
        #raise e
        return {
            'statusCode': 500,
            'headers': headers,
            'body': 'Error getting bucket and key from event'
        }
    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        print("CONTENT TYPE: " + response['ContentType'])
        #return response['ContentType']
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'ContentType': response['ContentType']})
        }
    except Exception as e:
        print(e)
        print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
        #raise e
        return {
            'statusCode': 500,
            'headers': headers,
            'body': 'Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket)
        }
