# Mocker Server #

A server to easily mock api requests, ideal for situations where you need to test api calls without having the backend server running.  
The server will use nedb to store the requests locally.  
This is not intended to be used in production environment.

## Command line options ##

| Flag | Description |
| ---- | ----------- |
| --config [file] or -c [file] | 'Path to the config file' |
| --save [file] | 'Create a config file with the default configurations'  |
| --port [port] or -p [port] | 'Express port number'  |
| --strict-url |  'Validate model url'  |
| --db-path | 'Path to db file'  |
| --in-memory | 'Run using a memory database'  |


## Configuration ##
The configuration will be stored in a json file, if no --config options is used, it will look for a **.mockerserver.json** in the running folder, if there is no default configuration file and no configuration file is specified, the default configurations will be used.

Your configuration should looks like:  
```
{  
  //Specify express port
  "express.port":3000,  

  //Validate the url for the apis
  "mocker.strictUrl":false,  

  //Database type, only nedb for now
  "db.type":"nedb",  

  //path to save database files
  "db.url":"mocker.db",  

  //Database specific options
  "db.options":{  
    "inMemoryOnly":false  
  }  
}
```

It is possible to pass the flag --save [file] to save the configuration to a given file


## Usage ##

#### Mock Requests ####

- GET /api/mock/{model}
- GET /api/mock/{model}/count
- GET /api/mock/{model}/{id}
- POST /api/mock/{model}
- PUT /api/mock/{model}/{id}
- DELETE /api/mock/{model}/{id}

#### Model Management ####
if the option --strict-url is used, then is necessary to register the models before utilization

- POST /api/model
- GET /api/model
- DELETE /api/model/{model}
- DELETE /api/model/{model}/force


## TODOs and future improvements ##
- Document APIs correctly
- Implement filter builder

- Implement Model store
  - force delete [delete the mocks]

- Implement TTL for the mocks


#### Multi User ####

- Implement user management  

  - POST api/user - create new user
  - DELETE api/user/{userId} - delete existing user
  - PUT api/user/{userId} - change existing user
  - GET api/user/{userId} - get user by id


#### Token authentication and validation ####

- Implement the use of token validation

  - POST api/user/{userId}/app/{appId}/token - create a new token
  - DELETE api/user/{userId}/app/{appId}/token/{tokenId}
  - GET api/token/{userId} - get user tokens
