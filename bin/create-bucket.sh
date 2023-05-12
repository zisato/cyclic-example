#!/usr/bin/env bash

container=$(docker-compose -f docker-compose.yml ps -q localstack)
docker exec -it ${container} awslocal s3 mb s3://$*

exitCode=$?
exit $exitCode