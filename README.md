## Project Description
This project is a rest API server built with NodeJS + Express. The the project aims to implement endpoints and have tests for the endpoints.

## Features
The server has API endpoints for Posts, Comments, and Users: create, read all, read one, update, and delete. 
The server uses simple validation for endpoints.
The server connects to a Mongo database to persist data.
The server initializes using a server configuration file.
The tests check each of the endpoints for expected responses.

## Data Model
Post { title, content, author }
User { username, email, about }
Comment { post, user, content }

## Experiences
Created an api server with routes for Posts, Users, and Comments.
Created simple validation checks for each of the routes.
Created models for the database.
Created test to check each of the responses for the endpoints.