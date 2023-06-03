const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const port = process.env.PORT || 3000;
const app = express();

//session and cookie imports
const session = require("express-session");
const passport = require("passport");

// Enable CORS for all routes
app.use(cors());
//Oauth
const passportSetUp = require("./services/passport");
const authCheck = require("./services/authCheck");
passportSetUp
authCheck

require("dotenv").config();
const cookiesessionkey = process.env.SESSION_KEY;
app.use(
  session({
    secret: cookiesessionkey,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());


// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app
  .use(bodyParser.json())
  .use((err, req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use('/', require('./routes'));



mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});
