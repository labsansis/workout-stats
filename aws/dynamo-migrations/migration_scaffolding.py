"""
This file contains the main scaffolding for dynamodb migrations.

The setup function `migrate` handles the command line arguments and connection to dynamo.

It accepts a list of migration functions that each take a dynamodb resource and an env string
(either "dev" or "prod") as inputs.
"""

import sys
from typing import Callable, List

import boto3
import click


def migrate(migrations: List[Callable]) -> None:
    @click.command()
    @click.option("--local", is_flag=True)
    @click.option("--remote", is_flag=True)
    @click.option("--dev", is_flag=True)
    @click.option("--prod", is_flag=True)
    def migrate_helper(local, remote, dev, prod):
        if not (dev or prod):
            sys.exit("One of --dev or --prod must be specified!")
        if local:
            dynamodb = boto3.resource("dynamodb", endpoint_url="http://localhost:8000")
        elif remote:
            dynamodb = boto3.resource("dynamodb")
        else:
            sys.exit("One of --local or --remote must be specified!")

        for migration in migrations:
            migration(dynamodb, "prod" if prod else "dev")

    migrate_helper()
