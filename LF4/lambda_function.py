import boto3
import json
from decimal import Decimal
import requests

sqs = boto3.client('sqs')
dynamodb = boto3.resource('dynamodb')
comprehend = boto3.client("comprehend")
db_client = boto3.client('dynamodb')

index = "topic"
domain = "search-users-iihnfmcca4kfjz2soa4oim4py4" 
region = "us-east-1"

table_name = 'user-profile'
table = dynamodb.Table(table_name) 
queue_url = 'https://sqs.us-east-1.amazonaws.com/924301557872/Q3'


# table for company
def insert_company_db(companyName, info):
    company_table_name = 'users_'+companyName 

    response = db_client.list_tables()        
    
    if company_table_name not in response['TableNames']:
        response = db_client.create_table(
            TableName=company_table_name,
            AttributeDefinitions=[
                {"AttributeName":"email", "AttributeType": "S"}, 
                ],
            KeySchema=[
                {"AttributeName":"email", "KeyType": "HASH"}, 
                ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 100,
                'WriteCapacityUnits': 100
            }
        )
 
    try:
        company_table = dynamodb.Table(company_table_name)
        response = company_table.put_item(Item={"email":info['email'],
                            "returnState":info['Return Stat'],
                            "State":info['State'], 
                            "Age":info['Age']})   
    except:
        print("cannot insert to dynamodb") 


# get the top rank topic
def insert_topic_db(message_body):
    company_name = message_body["Company"]
    company_table_name = 'topic_rank_'+company_name
    company_table = dynamodb.Table(company_table_name)
    user_topic = message_body["topic"][0]
    
    
    response = db_client.list_tables()        
    if company_table_name not in response['TableNames']:
        response = db_client.create_table(
            TableName=company_table_name,
            AttributeDefinitions=[
                {"AttributeName":"topic", "AttributeType": "S"}
                ],
            KeySchema=[
                {"AttributeName":"topic", "KeyType": "HASH"}
                ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 100,
                'WriteCapacityUnits': 100
            }
        )
 
    try: 
        key = {'topic': user_topic}
        company_table = dynamodb.Table(company_table_name)
        topic_num_response = company_table.get_item(Key=key)

        topic_num = topic_num_response.get('Item')['num']

        company_table.delete_item(Key=key)
        topic_num += 1
        company_table.put_item(Item={"topic":user_topic, "num":topic_num, 'companyName':company_name})

    except:
        # not get the the item
        response = company_table.put_item(Item={'companyName':company_name, "topic":user_topic, "num":1})

def lambda_handler(event, context):
    # Receive messages from SQS
    response = sqs.receive_message(
        QueueUrl=queue_url,
        MaxNumberOfMessages=10,
        VisibilityTimeout=30,
        WaitTimeSeconds=20
    )
    
    for message in response.get('Messages', []):
        # Parse the message body (assumed to be a JSON-encoded dict)
        received_msg = json.loads(message['Body'])
        received_msg = received_msg['Data']
        for message_body in received_msg:
            item = {key.replace('\ufeff', ''): value for key, value in message_body.items()}
            # Get the email address from the message body
            email = item.get('email')
            if not email:
                print('Error: email not found in message')
                continue
    
            # comprehend part
            text = item['Product']
            comprehend_response = comprehend.detect_key_phrases(Text=text, LanguageCode="en")
            keyphrases = comprehend_response['KeyPhrases']
            if len(keyphrases) > 0:
                processed_text = keyphrases[0]['Text']
                item['topic'] = [processed_text.lower()]
            else:
                item['topic'] = [text.lower()] 
                
            # opensearch
            url = f"https://{domain}.{region}.es.amazonaws.com/{index}/_doc"
            headers = {'Content-Type': 'application/json'}
            doc = {'email': item["email"], 'topic':item["topic"][0]}
            opensearch_response = requests.post(url, headers=headers, data=json.dumps(doc).encode('utf-'), auth=('master', 'qweIOP123*()'))
            if opensearch_response.status_code != 201:
                raise Exception('Error inserting document into OpenSearch index: {}'.format(opensearch_response.text))
            insert_topic_db(item)
            
            insert_company_db(item['Company'], item)
            # Check if the email already exists in DynamoDB
            response = table.get_item(Key={'email': email})
            stored_item = response.get('Item')
            if stored_item:
                item['totalReturn'] = stored_item['totalReturn'] + item['Return Stat'] if 'Return Stat' in item else stored_item['stored_item']
                item['totalPurchase'] = stored_item['totalPurchase'] + 1
                t1 = stored_item['topic']
                t2 = item['topic']
                item['topic'] = list(set(t1 + t2))
                table.delete_item(Key={'email': email})
                table.put_item(Item=item)
            else:
                # Add the new item to DynamoDB
                item['totalReturn'] = item['Return Stat'] if 'Return Stat' in item else 0
                item['totalPurchase'] = 1
                table.put_item(Item=item)

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
