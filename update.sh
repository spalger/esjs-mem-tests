#!/usr/bin/env bash

node build-configs.js
docker-compose up --build -d --remove-orphans