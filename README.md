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
Return the listing for the given model

- GET /api/mock/{model}/count  
Return the count for the given model

- GET /api/mock/{model}/{id}  
Return the item that match the id for the given model

- POST /api/mock/{model}  
Insert a new item for the given model

- PUT /api/mock/{model}/{id}  
Update the item that match the id for the given model

- DELETE /api/mock/{model}/{id}  
Delete the item that match the id for the given model


#### Query string filtering ####
The list and counting methods accept filter parameters through query string  

- GET /api/mock/person?filtering={name: 'anderson'}  

Possible filters are:  
- skip=<n>
- limit=<n>
- sort=fieldOne,fieldTwo,-fieldThree  
- filtering=<json formated filter>

#### Model Management ####
if the option --strict-url is used, then is necessary to register the models before utilization

- POST /api/model  
Register a new model

- GET /api/model  
Return existent models

- DELETE /api/model/{model}  
Delete a given model if no items are registered to the given model

- DELETE /api/model/{model}/force  
Delete a given model even if there are items registered to it


## TODOs and future improvements ##
- Document APIs correctly
- Implement correct filtering instead of using json
- Implement mongodb driver
- Implement Model store
  - force delete [delete the mocks]
- Implement TTL for the mocks
- Multi user and Token utilization
