import json
import pandas as pd
import boto3

db_client = boto3.client("dynamodb") 
dynamodb = boto3.resource("dynamodb")

def lambda_handler(event, context):
    
    companyEmail = event['queryStringParameters']['companyEmail']
    companyTable = dynamodb.Table('company-profiles')
    companyName = companyTable.get_item(Key={'email': companyEmail})['Item']['name']
    
    table_name = "recommended_users_"+companyName 
    response = db_client.scan(TableName=table_name)
    items = response['Items']
    cleaned_items = []
    for item in items:
        cleaned_items.append({"email": item['email']['S'], 
            "State": item['State']['S'], 
            "totalPurchase": item['totalPurchase']['N'], 
            "Age": item['Age']['N'], 
            "totalReturn": item['totalReturn']['N']
        })
    df = pd.DataFrame(cleaned_items)
    df = df.assign(returnRate = lambda x : x['totalReturn'].astype(int)/x['totalPurchase'].astype(int))
    df_state = df.groupby(by="State", dropna=False)['returnRate'].mean()
    
    def ageRange(age):
        if age > 0 and age < 15:
            return '<15'
        elif age > 15 and age < 30:
            return '15-30'
        elif age > 30 and age < 45:
            return '30-45'
        elif age > 45 and age < 60:
            return '45-60'
        elif age > 60 and age < 75:
            return '60-75'
        elif age > 75 and age < 140:
            return '>75'
        else:
            return 'NaN'
    df['ageRange'] = df.apply(lambda row: ageRange(int(row['Age'])), axis=1)
    df_age = df.groupby(by="ageRange", dropna=False)['email'].count()
    
    state = df_state.to_dict()
    age = df_age.to_dict()
    
    
    table_name = "topic_rank_"+companyName 
    response = db_client.scan(TableName=table_name)
    items = response['Items']
    cleaned_items = []
    for item in items:
        cleaned_items.append({"topic": item['topic']['S'], 
            "num": item['num']['N']
        })
    df = pd.DataFrame(cleaned_items)
    
    df_popular = df.sort_values('num')[["topic", "num"]].head(5)
    popular = df_popular.to_dict()

    resp = { "data": {'age_info': age, 
            'state_info': state,
            'topic_info': popular}}
    
    # TODO implement
    return {
        "statusCode": 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',},
        "body": json.dumps(resp)
    }