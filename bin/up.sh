#!/usr/bin/env bash

docker-compose -f docker-compose.yml pull
docker-compose -f docker-compose.yml up
exitCode=$?
docker-compose -f docker-compose.yml down --remove-orphans
exit $exitCode