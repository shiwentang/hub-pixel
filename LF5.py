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
        highProduct = ", ".join(item['highProduct'])
        
        
        message = f"Dear {companyName},\n \nBased on the analysis of your sales data (uploaded into our platform),"+\
        f"it shows that the age group ranging from {highAgePurchase} frequently purchased products from {companyName}."+\
        f"Furthermore, some Staes have a higher return rate, such as {highReturnState}. It could be something"+\
        f"{companyName} work on to mitigate future returns, which will essentially aid in customer satisfaction."+\
        f"Below is the list of frequently bought products: {highProduct}\n \n"+\
        f"Best, \nHubPixel"

        send_email(item['email'], message)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
