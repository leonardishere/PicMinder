import json
import boto3
import os

# Get the service client.
s3 = boto3.client('s3', region_name='us-west-2')
PICTURE_BUCKET = os.environ['PICTURE_BUCKET']

def handler(event, context):
    print('get download url event')
    print(event)

    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,GET"
        },
        'body': json.dumps({
            'event': event
        })
    }

    # Generate a random S3 key name
    key = str(randrange(999999)).zfill(6)
    input_key = 'input_{}'.format(key)
    output_key = 'output_{}'.format(key)

    # Generate the presigned URL for put requests
    presigned_put_url = s3.generate_presigned_url(
        ClientMethod='put_object',
        Params={
            'Bucket': PICTURE_BUCKET,
            'Key': input_key
        }
    )

    presigned_get_input_url = s3.generate_presigned_url(
        ClientMethod='get_object',
        Params={
            'Bucket': PICTURE_BUCKET,
            'Key': input_key
        }
    )

    presigned_get_output_url = s3.generate_presigned_url(
        ClientMethod='get_object',
        Params={
            'Bucket': PICTURE_BUCKET,
            'Key': output_key
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
            'bucket': PICTURE_BUCKET,
            'key': key,
            'put_url': presigned_put_url,
            'get_input_url': presigned_get_input_url,
            'get_output_url': presigned_get_output_url
        })
    }
