Creating this project to relearn web app/rest api fundementals

## Structure

First thing is deciding on a structure, folder layout and architecture of the REST API

### Seperate app and server

Why separate app and server?

1. They are two entities completly, one is our app logic and one is our http server
2. Will allow us to run unit tests without initializing our server
3. In the future if we want to change network configuration we can easily do it in the server

### 3-Layer architecture

1. **Web Layer**: Responsible for sending, recieving and validating HTTP requests. (routes, controllers and middleware).
2. **Service Layer**: Will hold our business logic.
3. **Data Access Layer**: Will be responsible for reading/writing to our DB.

#### Web Layer

In this layer we will define our 3 main functions: routes, middleware and controllers

- **Routes**: The path of our API endpoints and where they point to
- **Controllers**: The functions that process an endpoint. These should be kept free of business logic and should get any data from the request and dispatch to the services. Once the services are finished it should send a response in the res. Do not pass any web objects to the services, unpack and format only in the controller
- **Middleware**: Any reusable functions that run on all the routes should be placed here, like auth or other kind of validation

It is better to group our folders by components then by routes, controllers, services.

```
app
│
└───users
│   │   routes.js
│   │   controller.js
│   │   services.js
│
└───middleware
│
└───utils
```

As opposed to

```
app
│
└───routes
│   │   users.js
│
└───controllers
│   │   users.js
│
└───services
│   │   users.js
│
└───middleware
│
└───utils
```

This will keep our related functionality grouped and easier to find.

## Auth

The auth solution I went with for this app is a simple JWT token

### JWT

#### How it work

## Middleware & Validation

## DB
