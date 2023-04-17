import boto3
import csv
import json

s3 = boto3.client('s3')
sqs = boto3.client('sqs')
queue_url = 'https://sqs.us-east-1.amazonaws.com/115482439616/myQueue'

def lambda_handler(event, context):
    # Get the S3 bucket and key from the event
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    file_key = event['Records'][0]['s3']['object']['key']
    if not file_key.endswith('.csv'):
        return {
        'statusCode': 200,
        'body': 'not a csv'
    }
    # Download the CSV file from S3
    file_obj = s3.get_object(Bucket=bucket_name, Key=file_key)
    file_content = file_obj['Body'].read().decode('utf-8')
    # Parse the CSV file and send each row (excluding the header row) to SQS
    csv_reader = csv.reader(file_content.split('\n'), delimiter=',', quotechar='"')
    header_row = next(csv_reader)
    header_row = [i.replace('\ufeff', '') for i in header_row]
    for row in csv_reader:
        # Create a dictionary for the current row
        row_dict = {}
        for i in range(len(header_row)):
            cell_value = row[i].strip() if row[i].strip() != "" else "unknown"
            row_dict[header_row[i]] = cell_value
        
        # Send the row to SQS
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