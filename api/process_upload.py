import boto3
import os
from zipfile import ZipFile
from PIL import Image

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
    input_key = event['Records'][0]['s3']['object']['key']
    key = input_key.split('_')[1]
    inter_key = '/tmp/inter_{}'.format(key)
    output_key = 'output_{}'.format(key)
    # Get the object from s3
    s3_object = s3.get_object(Bucket=bucket, Key=input_key)
    # Read the object
    contents = s3_object['Body'].read()
    # I don't want to do it this way, but for now do operations on disk
    filename = '/tmp/'+key
    with open(filename, 'wb') as f:
        f.write(contents)
    # Process the object
    with ZipFile(filename, 'r') as zipobj:
        zipobj.extractall(inter_key)
    with ZipFile('/tmp/output.zip', 'w') as zipobj:
        os.chdir(inter_key)
        for fp in os.listdir():
            Image.open(fp).reduce(2).save(fp)
            zipobj.write(fp)
            os.remove(fp) # optionally delete the file to save disk space
        os.chdir('..')
    # Upload the processed object
    with open('/tmp/output.zip', 'rb') as f:
        s3.upload_fileobj(f, bucket, output_key)
    #s3.upload_fileobj(key, bucket, new_key)
    #s3.upload_fileobj(s3_object, bucket, new_key)
    #s3.put_object(Body=contents, Bucket=bucket, Key=new_key)
    # HTTP response
    return {
        'statusCode': 200,
        'headers': headers,
        'body': '{"NewKey":"'+output_key+'"}'
    }
