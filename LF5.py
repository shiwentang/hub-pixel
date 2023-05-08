import json
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table('analysis_table')
def send_email(dest, message):
    ses = boto3.client('ses')
    response = ses.send_email(
        Source = 'coms6998cloudcomputing@gmail.com',
        Destination = {'ToAddresses': [dest]},
        Message = {'Subject':{'Data': 'Insights on Most Purchased Age Group and High Return Rate States of Your Products'},
                    'Body':{'Text':{'Data':message}}}
    )

def lambda_handler(event, context):
    response = table.scan()
    for item in response['Items']:
        companyName = item['name']
        highAgePurchase = ", ".join(item['highAgePurchase'])
        highReturnState = ", ".join(item['highReturnState'])
        message = f"Dear {companyName},\n \n After analyzing your sales data, I have found that your most frequently purchased products are mostly preferred by the age group between {highAgePurchase}."+\
        f"Additionally, I also noticed that the products from certain states have a high return rate: {highReturnState}.\n \n"+\
        f"I believe it is important to bring this to your attention as it can help you focus your marketing efforts and product development towards the specific age group that is most interested in your products. Furthermore, addressing the high return rate in certain states can help you improve your product quality and customer satisfaction. \n \n " + \
        f"Best, \n HubPixel"
        send_email(item['email'], message)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
