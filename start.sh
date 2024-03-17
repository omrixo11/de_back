#!/bin/bash

docker stop my_backend_container
docker rm my_backend_container
docker build -t backendimage .
docker run -d \
  --name my_backend_container \
  -p 5001:5001 \
  -v /home/debian/backend/media:/usr/src/app/media \
  backendimage

