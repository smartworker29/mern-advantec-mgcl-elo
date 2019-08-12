## Get Started

### 1. Prerequisites

- [NodeJs](https://nodejs.org/en/)
- [NPM](https://npmjs.org/) - Node package manager

Please install nodeJS on your local and check NodeJS/NPM versions.
```
$ npm -v
$ node -v
```

### 2. Installation

On the command prompt run the following commands:
1) Clone git repo and fetch/pull the code to get latest code.
```
$ git fetch
$ git pull
```

2) First of all, please update .env file in the root folder so that application could connect to MS SQL Database.
```
DB_CLIENT=mssql
DB_HOST=localhost
DB_USER=<YOUR_DB_USER>
DB_PASSWORD=<YOUR_DB_PASSWORD>
DB_NAME=<YOUR_DB_NAME>
DB_PORT=1433
```
As default, MSSQL username is `sa` and port is `1433`. 

3) Then, install npm modules. 
```
 $ npm install
 $ npm run migrate
 ```

4) Finally, start and build the application:
 
 ```
 $ npm run build (For development)
```

### 3. Usage

URL : http://localhost:3000/

Navigate to http://localhost:3000/swagger for the API documentation.
