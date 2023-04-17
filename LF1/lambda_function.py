import boto3
import json
from decimal import Decimal

dynamodb = boto3.resource("dynamodb")
comprehend = boto3.client("comprehend")

def lambda_handler(event, context):
    # Get data from DynamoDB
    table = dynamodb.Table("user_profiles")
    response = table.scan()
    items = response['Items']
    
    # personal_info = ["phoneNumber", "lastName", "email", "firstName" ]

    # Process data using AWS Comprehend
    for item in items:
        if "Product" in item:
            text = item["Product"] 
            comprehend_response = comprehend.detect_key_phrases(Text=text, LanguageCode="en")
            keyphrases = comprehend_response['KeyPhrases']
            if len(keyphrases) > 0:
                key = keyphrases[0]['Text']
                # print(key)

                item['topic'] = key
                table.delete_item(Key={'email': item['email']})
                item = json.loads(json.dumps(item), parse_float=Decimal)
                table.put_item(Item=item)
                    

    return {
        "statusCode": 200,
        "body": json.dumps("Data processed successfully")
    }
