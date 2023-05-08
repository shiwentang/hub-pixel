import boto3
import json
from decimal import Decimal
import requests
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource("dynamodb")
companyTable = dynamodb.Table('company-profiles')
userTable = dynamodb.Table('user-profile')
db_client = boto3.client("dynamodb")

index = "topic"
domain = "search-users-iihnfmcca4kfjz2soa4oim4py4"
region = "us-east-1"


def getUserByTopic(topic): #topic -> email from opensearch,去重

    url = f"https://{domain}.{region}.es.amazonaws.com/{index}/_search?q="
    headers = {'Content-Type': 'application/json'}
    
    newUrl = url+topic
    response = requests.get(newUrl, headers = headers, auth=('master', 'qweIOP123*()')).json()
    users_email = []
    if 'hits' in response:
        if 'hits' in response['hits']:
            for item in response['hits']['hits']:
                email = item['_source']['email']
                users_email.append(email)
                
    users_email = list(set(users_email))
    return users_email
                

def getTopicByUser(user): #email -> topic from dynamodb

    user_table = dynamodb.Table('user-profile')
    key = {'email':user} 
    
    print(user_table.get_item(Key=key))
    item = user_table.get_item(Key=key)['Item']
    
    topic = item['topic']
    return topic

def getTop5Topics(companyName):  # Get top5 topic from a given company
    table_name = 'topic_rank_'+companyName
    table = dynamodb.Table(table_name)
    response = table.scan()
    items = response['Items']
    while 'LastEvaluatedKey' in response:
        print(response['LastEvaluatedKey'])
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        items.extend(response['Items'])
    # Sort the items by num attribute in descending order and get the top 5 items
    sorted_items = sorted(items, key=lambda x: x['num'], reverse=True)[:5]
    top_5_topics = [item['topic'] for item in sorted_items]
    
    return top_5_topics
    
def getInfoByUser(user):
    
    user_table = dynamodb.Table('user-profile')
    key = {'email':user} 
    item = user_table.get_item(Key=key)['Item']
    
    return {"email":user, "phoneNumber":item['phoneNumber']}
    
def getFullInfoByUser(user):
    user_table = dynamodb.Table('user-profile')
    key = {'email':user} 
    item = user_table.get_item(Key=key)['Item']
    
    return {"email":user,
        "totalPurchase":item['totalPurchase'],
        "totalReturn":item['totalReturn'],
        "State":item['State'], 
        "Age":item['Age'], 
    }

# store the recommendation history in a table
def insert_reommend_db(companyName, info):
    company_table_name = 'recommended_users_'+companyName 

    response = db_client.list_tables()        
    
    # print(response['TableNames'])
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
                            "totalPurchase":info['totalPurchase'],
                            "totalReturn":info['totalReturn'],
                            "State":info['State'], 
                            "Age":info['Age']})   
    except:
        print("cannot insert to dynamodb") 

def lambda_handler(event, context):
    try:
        email = event['queryStringParameters']['companyEmail']
        print(email)
        print(companyTable.get_item(Key={'email': email}))
        companyName = companyTable.get_item(Key={'email': email})['Item']['name']
        print(companyName)
        topics = getTop5Topics(companyName)
        users = [] # users who purchased top5 topics
        for topic in topics:
            users.extend(getUserByTopic(topic))
        users = set(users)
        print(users)
        
        topics = [] # get topics of users
        for u in list(users):
            topics.extend(getTopicByUser(u))
        topics = set(topics)
        print(topics)
        
        recommenedUser = []
        for topic in list(topics):
            recommenedUser.extend(getUserByTopic(topic))
        recommenedUser = set(recommenedUser)
        print(recommenedUser)
        
        output = []
        for user in list(recommenedUser):
            if user not in list(users):
                insert_reommend_db(companyName, getFullInfoByUser(user))
                output.append(getInfoByUser(user))


        resp = {"output":output}
    except:
        resp = {"output":[]}

    return {
        "statusCode": 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',},
        "body": json.dumps(resp)
    }