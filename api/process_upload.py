import json
import uuid
import boto3
import os
import urllib.parse

# Get the service client
s3 = boto3.client('s3', region_name='us-west-2')
PICTURE_BUCKET = os.environ['PICTURE_BUCKET']
headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,GET"
}

def handler(event, context):
    # Get the object from the event
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    # Get the object from s3
    s3_object = s3.get_object(Bucket=bucket, Key=key)
    # Read the object
    contents = s3_object['Body'].read()
    # I don't want to do it this way, but for now do operations on disk
    filename = '/tmp/'+key
    with open(filename, 'wb') as f:
        f.write(contents)
    # TODO: process the object

    # Upload the processed object
    new_key = 'output_{}'.format(key) # TODO: 'output_{}'.format(key.split('_'[1]))
    with open(filename, 'rb') as f:
        s3.upload_fileobj(f, bucket, new_key)
    #s3.upload_fileobj(key, bucket, new_key)
    #s3.upload_fileobj(s3_object, bucket, new_key)
    #s3.put_object(Body=contents, Bucket=bucket, Key=new_key)
    # HTTP response
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'NewKey': new_key})
    }
