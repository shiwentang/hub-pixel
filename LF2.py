import json
import pandas as pd
import boto3

db_client = boto3.client("dynamodb") 
dynamodb = boto3.resource("dynamodb")


def lambda_handler(event, context):
    
    companyEmail = event['queryStringParameters']['companyEmail']
    companyTable = dynamodb.Table('company-profiles')
    companyName = companyTable.get_item(Key={'email': companyEmail})['Item']['name']
    
    table_name = "users_"+companyName  
    response = db_client.scan(TableName=table_name)
    items = response['Items']
    cleaned_items = []
    for item in items:
        cleaned_items.append({"email": item['email']['S'], 
            "State": item['State']['S'], 
            "Age": int(item['Age']['N']), 
            "returnState": int(item['returnState']['N'])
        })
        
    df = pd.DataFrame(cleaned_items)
    df_state = df.groupby(by="State", dropna=False).mean()['returnState']

    #<18, 18-23, 23-27, 27-30, 30 above
    def ageRange(age):
        if age > 0 and age < 18:
            return '< 18'
        elif age > 18 and age < 23:
            return '18-23'
        elif age > 23 and age < 27:
            return '23-27'
        elif age > 27 and age < 30:
            return '27-30'
        elif age > 30:
            return '>30'
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
    
    df_popular = df.sort_values('num', ascending=False)[["topic", "num"]].head(5)
    popular = df_popular.to_dict()

    resp = { "data": {'age_info': age, 
            'state_info': state,
            'topic_info': popular}}
            
    popularProduct = [popular['topic'][item] for item in popular['topic']]
            
    # store data in dynamodb
    analysis_table_name = "analysis_table"
    response = db_client.list_tables()        

        
    highReturnValue = sorted(state.items(), key=lambda x:x[1])[-1][1]
    state_high_retrun = []
    for item in state:
        if state[item] == highReturnValue:
            state_high_retrun.append(item)

    highAgePurchase = sorted(age.items(), key=lambda x:x[1])[-1][1]
    age_high_purchase = []
    for item in age:
        if age[item] == highAgePurchase:
            age_high_purchase.append(item)

    
    if analysis_table_name not in response['TableNames']:
        response = db_client.create_table(
            TableName=analysis_table_name,
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
        analysis_table = dynamodb.Table(analysis_table_name)
        response = analysis_table.put_item(
                        Item={"email":companyEmail,
                            "name":companyName,
                            "highReturnState":state_high_retrun,
                            "highAgePurchase":age_high_purchase, 
                            "highProduct": popularProduct
                        })
    except:
        print("cannot insert to dynamodb")

    
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