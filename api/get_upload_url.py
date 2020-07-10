import json
import uuid
import boto3
import os

# Get the service client.
s3 = boto3.client('s3', region_name='us-west-2')
PICTURE_BUCKET = os.environ['PICTURE_BUCKET']

def handler(event, context):
    # Generate a random S3 key name
    key = uuid.uuid4().hex
    put_key = 'input_{}'.format(key)
    get_key = 'input_{}'.format(key) # todo: should be output_

    # Generate the presigned URL for put requests
    presigned_put_url = s3.generate_presigned_url(
        ClientMethod='put_object',
        Params={
            'Bucket': PICTURE_BUCKET,
            'Key': put_key
        }
    )

    presigned_get_url = s3.generate_presigned_url(
        ClientMethod='get_object',
        Params={
            'Bucket': PICTURE_BUCKET,
            'Key': get_key
        }
    )

    # Return the presigned URL
    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,GET"
        },
        'body': json.dumps({
            'key': key,
            'put_url': presigned_put_url,
            'get_url': presigned_get_url
        })
    }
