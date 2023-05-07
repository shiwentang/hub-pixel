import boto3
import csv
import json
import pandas as pd

s3 = boto3.client('s3')
sqs = boto3.client('sqs')
queue_url = 'https://sqs.us-east-1.amazonaws.com/924301557872/queueDemo' 

def lambda_handler(event, context):
    # Get the S3 bucket and key from the event
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    file_key = event['Records'][0]['s3']['object']['key']
    if not file_key.endswith('.csv'):
        return {
        'statusCode': 200,
        'body': 'not a csv'
    }
    # Read CSV file from S3
    response = s3.get_object(Bucket=bucket_name, Key=file_key)
    print(response)
    status = response.get("ResponseMetadata", {}).get("HTTPStatusCode")
    df = pd.read_csv(response.get("Body"))
    # Data Clean
    items = ['firstName', 'lastName', 'phoneNumber', 'email', 'Age', 'Product', 'Return Stat', 'State', 'Company']
    df = df.filter(items=[item for item in items if item in df.columns])

    for index, row in df.iterrows():
        # Send the row to SQS
        row_dict = dict(row)
        response = sqs.send_message(
            QueueUrl=queue_url,
            MessageBody=json.dumps(row_dict)
        )
        print(row_dict)
        print('Sent message to SQS: {}'.format(response['MessageId']))
    
    # Return a successful response
    return {
        'statusCode': 200,
        'body': 'CSV file processed successfully'
    }