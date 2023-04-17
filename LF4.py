import boto3
import json
from decimal import Decimal

sqs = boto3.client('sqs')
dynamodb = boto3.resource('dynamodb')
table_name = 'user_profiles'
table = dynamodb.Table(table_name)
queue_url = 'https://sqs.us-east-1.amazonaws.com/115482439616/myQueue'

def lambda_handler(event, context):
    # Receive messages from SQS
    response = sqs.receive_message(
        QueueUrl=queue_url,
        MaxNumberOfMessages=10,
        VisibilityTimeout=30,
        WaitTimeSeconds=20
    )
    
    # Process each message from SQS
    for message in response.get('Messages', []):
        # Parse the message body (assumed to be a JSON-encoded dict)
        message_body = json.loads(message['Body'])
        message_body = {key.replace('\ufeff', ''): value for key, value in message_body.items()}
        print(message_body)
        # Get the email address from the message body
        email = message_body.get('email')
        if not email:
            print('Error: email not found in message')
            continue
        
        # Check if the email already exists in DynamoDB
        response = table.get_item(Key={'email': email})
        print(response)
        existing_item = response.get('Item')
        
        # If the email already exists, update the existing item
        if existing_item:
            merged_dict = existing_item.copy()
            merged_dict.update(message_body)
            table.delete_item(Key={'email': email})
            item = json.loads(json.dumps(merged_dict), parse_float=Decimal)
            table.put_item(Item=item)
            print('Updated item in DynamoDB: {}'.format(email))
        # If the email does not already exist, add the new item to DynamoDB
        else:
            # Add the new item to DynamoDB
            item = json.loads(json.dumps(message_body), parse_float=Decimal)
            table.put_item(Item=item)
            print('Added item to DynamoDB: {}'.format(email))
        
        # Delete the message from SQS
        sqs.delete_message(
            QueueUrl=queue_url,
            ReceiptHandle=message['ReceiptHandle']
        )
    
    # Return a successful response
    return {
        'statusCode': 200,
        'body': 'SQS messages processed successfully'
    }
