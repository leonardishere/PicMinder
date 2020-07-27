import json
import boto3
import os

# Get the service client.
s3 = boto3.client('s3', region_name='us-west-2')
PICTURE_BUCKET = os.environ['PICTURE_BUCKET']
headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,GET"
}

def handler(event, context):
    try:
        key = event['queryStringParameters']['jobid']
        output_key = 'output_{}'.format(key)

        presigned_get_output_url = s3.generate_presigned_url(
            ClientMethod='get_object',
            Params={
                'Bucket': PICTURE_BUCKET,
                'Key': output_key
            }
        )

        return {
            'statusCode': 200,
            'headers': headers,
            'body': presigned_get_output_url
        }

    except Exception as e:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': 'Error: jobid not provided'
        }
