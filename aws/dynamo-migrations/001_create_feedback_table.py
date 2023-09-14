from migration_scaffolding import migrate


def create_feedback_table(dynamodb, env):
    dynamodb.create_table(
        TableName=f"WsFeedback-{env}",
        KeySchema=[
            # uuid
            {"AttributeName": "id", "KeyType": "HASH"}
        ],
        AttributeDefinitions=[
            {"AttributeName": "id", "AttributeType": "S"},
        ],
        BillingMode="PAY_PER_REQUEST",
    )

if __name__ == "__main__":
    migrate([create_feedback_table])
