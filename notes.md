I tried as much much as possible to be clear. Please feel free to email me amulya.pamidimukkala@gmail.com if you have any questions regarding the project. 
Currently the project passed all the test cases provided
Following is the brief notes regarding the project
# How to run:
    npm install
    npm start
    for test cases: npm test
# npm packages used:
    *  nconf: Used to maintain configuration with files, and to maintain configuration variables in one place
    * body-parser: middleware to allow incoming request body parsing in a middleware before handlers, available under the req.body property
    * path: provides utilities for working with file and directory paths. Used for 404 page
    * winston: used for maintaining error logs
    * swapi-node: A Node.js helper library for http://swapi.co/ - the Star Wars API
    * winston: used for logging mechanism
# Modules:
--
* **People Module**
    * **people.controller**
        * contains logic to call swapi api service and sends back the response.
    * **people.middleware**
        * middleware to validate input parameters

* **Planets Module**
    * **planets.controller**
        * contains logic to call swapi api service and sends back the response.
    * **planets.middleware**
        * middleware to validate input parameters

* **Shared Service**
    contains a shared service for planets and people controller.
    contains a method which calls swapi service get method with the respective url(people, planets, species)

* **Swapi Service**
    contains a method to call swapi API
    All swapi API can be made by calling this service

--- To show case my skills and ideas I included the following modules.

* **Default Module**
    + This folder has files that are commonly used in rest of the modules in Server
    * **default.controller**
        * This file is extended by all other controllers in various modules. It consists of common logic required for all the controllers.
    * **default.middleware**
        * This file is has all the initial middilewares like bodyparser,session,cookie that are need for req before handling it in routes.
    * **default.logger**
        * This file is has customized logger that is used in this server instead of using console log. 
    * **default.response**
        * This file is has a DefaultResponse that has a specific format, instead of sending the express response directly, we can send a particular format in response. this is my idea. but currently sending using express res method according to test cases
    * **default.model**
        * This file is has a Default Model which must be extended by every model we create in this project, because this default model has all the validation code and customized functions to set constraints on the fields.
---

* **Errors Module**
    + This folder has files that has logic which handles the thrown errors and unhandled errors in the rest of routes/middlewares/controllers
    * **error.middleware**
        * This file is function that handles the all kinds of error that are thrown or unhandled in the routes/middlewares/controllers. - example which directs the unhandled routes to 404 page
    * **error.route**
        * This route throws error for all other routes that are not handled in web server
---
