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

The flow of the request will come into our Web Layer to the routes -> middleware -> controllers, at this point all HTTP and express context ends here. From the controller it will then be passed to the Service Layer -> Services. The services can then access the Data Access Layer or make other requests to any external APIs. The final result is then passed back to the controller to return the request back to the user.

#### Web Layer

In this layer we will define our 3 main folders: routes, middleware and controllers

- **Routes**: The path of our API endpoints and where they point to
- **Controllers**: The functions that process an endpoint. These should be kept free of business logic and should get any data from the request and dispatch to the services. Once the services are finished it should send a response in the res. Do not pass any web objects to the services, unpack and format only in the controller
- **Middleware**: Any reusable functions that run on all the routes should be placed here, like auth or other kind of validation

## Auth

## Middleware & Validation

## DB
