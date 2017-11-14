# Mocker Server #

A server to easily mock api requests, ideal for situations where you need to test api calls without having the backend server running.  
The server will use nedb to store the requests locally.  
This is not intended to be used in production environment.

## Configuration ##


## Usage ##

#### Mock Requests ####

- GET /api/mock/{model}
- GET /api/mock/{model}/count
- GET /api/mock/{model}/{id}
- POST /api/mock/{model}
- PUT /api/mock/{model}/{id}
- DELETE /api/mock/{model}/{id}

#### Model Management ####
In case the option "Strict Url" is activated, it is necessary to register the models before use

- POST /api/model
- GET /api/model
- DELETE /api/model/{model}
- DELETE /api/model/{model}/force


## TODOs ##
- Implement filter builder

- Implement Model store
  - force delete [delete the mocks]



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
