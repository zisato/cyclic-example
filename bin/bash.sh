#!/usr/bin/env bash

container=$(docker-compose -f docker-compose.yml ps -q nodejs)
docker exec -it ${container} bash