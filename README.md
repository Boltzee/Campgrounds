<p>
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB">
  <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" >
  <img src="https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node.js&logoColor=white">
  <img src="https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white">
</p>

# Campgrounds-app

This site keeps track of details of all the campgrounds that the user has been to. Includes Authentication/Authorisation by Passport.js.

To see website in action, visit [http://codfish-yelpcamp.herokuapp.com/](http://codfish-yelpcamp.herokuapp.com/)
<br />

## Description

### App Features

-   Uses Passport.js authentication.
-   Modern UI using react, material-bootstrap.
-   The app is deployed using heroku.

User-Features:

1. Login & register
2. Responsive design
3. Create a campground.
4. Edit his/her created campgrounds.
5. Authentication and session using passport auth.

## Installation Requirements

-   Install Node.js >= 10
-   Install npm/yarn

## Steps To Install

### STEP 1 (CLONING AND SETTING ENVIRONMENT VARIABLES)

      1. Clone this project into your preffered directory

      2. Create a .env file and populate it with your mongodb uri and mapbox key.

      > Please note that it is mandatory to provide both the above mentioned fields, failing which either the app will not be able to connect to the database or some functionality might not work properly.

<br >

### STEP 2 ( Run Locally on Your Machine)

You need Node, NPM properly installed.

#### Install dependencies

```shell
    npm install
```

#### Run the main application server

```shell
    node index.js
```

<br >

## Known Bugs

There are no known bugs.

## Technologies

###### Back-end

NodeJS, Express, Passport, mongoose, MongoDB Atlas.

###### Fron-end

EJS, bootstrap 5.
<br />
