# Train API

## Description
This is a backend-project built in Node.js/Express handling train data from a MySQL database.


## Tech Stack
* Node.js
* Express
* MySQL 

## Installation Guide
1. **Clone the repository**
```bash
git clone https://github.com/EmelieVilor/slutprojektBackend.git
```
2. **Install dependencies**
```bash
npm install 
```
3. **Create an .env file in the root of your project with these variables**
```bash
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Password_for_database
DB_NAME=Database_name
```
4. **Start the server and lets go!**
```bash
npm run dev 
```

## API Endpoints

| Method | Endpoint                          | Description                              |
| ------ | --------------------------------- | ---------------------------------------- |
| GET    | `/api/tag`                        | Get all events                           |
| GET    | `/api/tag/vagnstyp`               | Get a specific event                     |
| GET    | `/api/tag/vagnar/antal`           | Get all contributions for an event       |
| GET    | `/api/tag/vagnar`                 | Get all events hosted by a specific user |
| GET    | `/api/tag/:station`               | Get all invites                          |
| GET    | `/api/tag`                        | Get all users                            |
| POST   | `/api/tag`                        | Create a new invite                      |
