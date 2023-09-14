from chalice import Chalice, BadRequestError
import boto3
import os
from datetime import datetime
from uuid import uuid4

app = Chalice(app_name="ws-lambda")

ENV = os.getenv("ENVIRONMENT")

feedback_table = boto3.resource("dynamodb").Table(f"WsFeedback-{ENV}")


@app.route("/feedback", methods=["POST"], cors=True)
def index():
    payload = app.current_request.json_body
    if len(payload.get("message", "")) == 0 or len(payload.get("message", "")) > 2000:
        raise BadRequestError("message should be between 1 and 2000 chars")

    if len(payload.get("userId", "")) > 100:
        raise BadRequestError()
    if len(payload.get("name", "")) > 100:
        raise BadRequestError()
    if len(payload.get("email", "")) > 100:
        raise BadRequestError()

    feedback_item = {
        "id": str(uuid4()),
        "userId": payload.get("userId"),
        "name": payload.get("name"),
        "email": payload.get("email"),
        "message": payload.get("message"),
        "timestamp": int(datetime.utcnow().timestamp()),
    }

    feedback_table.put_item(Item=feedback_item)

    return {"status": "ok"}
