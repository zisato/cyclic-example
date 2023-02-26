#!/usr/bin/env bash

docker logs -f $(docker-compose -fdocker-compose.yml ps -q nodejs)