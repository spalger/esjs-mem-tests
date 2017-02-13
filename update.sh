#!/usr/bin/env bash

node update-compose-config.js
docker-compose up --build -d --remove-orphans