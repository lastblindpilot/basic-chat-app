# Basic Chat Application

## Project stack

* Angular 4 – frontend framework
* Node.js – runtime environment
* Socket.IO – transparent connection, bidirectional event-based communication between
server and client, used for sending messages
* Express.js back-end framework

## Prerequisites

1. Node.js installed
2. Angular/CLI: npm i -g @angular/cli (version compatible with Angular 4)
3. Installed dependencies: npm install (run command from root folder of the broject)

## Run / Make instructions

### Development mode
`npm run dev` – runs concurrently ng serve for Angular development mode and runs nodemon for
backend Node.js, all the source editing both client and backend initialize application restart.
Application is available at localhost:4200

### Production mode:
`npm run prod` – runs concurrently ng build –env=prod for Angular 4 app and node
server/bin/www commands.
Application is available at localhost:3000

### Production environment launch:
`npm start`

## TODO
Develop more tests