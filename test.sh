#!/bin/bash

clear

export STAGE=test
export JWT_KEY=esgi-test
export DATABASE_URL=postgres://postgres:password@localhost:5432/postgres 

docker run --name bng-test-db -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres:13-alpine

echo "$(docker inspect -f {{.State.Status}} bng-test-db)"

while [ "$(docker inspect -f {{.State.Status}} bng-test-db)" != "running" ]; do
  echo "Waiting for test database to start..."
  sleep 1
done

npm run seed

if [[ "$1" == "--cov" ]]; then
  npx jest --verbose --detectOpenHandles --coverage 
else
  npx jest --verbose --detectOpenHandles 
fi

docker container stop bng-test-db
docker container rm bng-test-db

