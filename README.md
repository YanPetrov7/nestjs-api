# NestJs Rest API

## Installation
* __Install__ [node.js](https://nodejs.org/) & [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* Once the installation is complete, check the Node.js and npm versions using the following commands:
```bash
node -v
npm -v
```
* __Install__ [docker](https://docs.docker.com/get-docker/) & [docker-compose](https://docs.docker.com/compose/install/)
* Once the installation is complete, check the docker and docker-compose versions using the following commands:
```bash
docker -v
docker-compose -v
```
* Clone this repository
```bash
git clone git@github.com:YanPetrov7/nestjs-api.git
```
* Move to the directory with the cloned repository
```bash
cd nestjs-api
```
* Install dependencies
```bash
npm install
```

## Usage
* Make a file with environment variables. For example `.env`:
```bash
# General info
POSTGRES_USER = 'postgres'
POSTGRES_PASSWORD = '123'
POSTGRES_DB = 'nest'
POSTGRES_DB_TEST = 'nest-test'
JWT_SECRET = 'secret'

# Construct the database URL using variables
DATABASE_HOST = 'dev-db'
DATABASE_PORT = 5432
DATABASE_URL = postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${POSTGRES_DB}

# Construct the test database URL using variables
TEST_DATABASE_HOST = 'test-db'
TEST_DATABASE_PORT = 5436
TEST_DATABASE_URL = postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${TEST_DATABASE_HOST}:${TEST_DATABASE_PORT}/${POSTGRES_DB_TEST}

# Construct the local test database URL using variables
LOCAL_DATABASE_URL = postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${TEST_DATABASE_HOST}:${DATABASE_PORT}/${POSTGRES_DB_TEST}
```
* Run the application
```bash
docker-compose up --build
```
* Now you can use the application. For example, you can use [Postman](https://www.postman.com/downloads/) to send requests to the application. The application will be available at [http://localhost:3000](http://localhost:3000)

## Testing
* Run the e2e tests
```bash
npm run test:e2e
```