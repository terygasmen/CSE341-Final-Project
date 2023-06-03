const passport = require('passport');
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();
const CLIENTID = process.env.GOOGLE_CLIENT_ID;
const CLIENTSECRET = process.env.GOOGLE_CLIENT_SECRET;
//const SESSION_KEY = process.env.SESSION_KEY;
const mongodb = require('../db/connect');
//from models

passport.serializeUser((user, done) => {
  //console.log('serializeUser user:', user);
  done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
  await mongodb
    .getDb()
    .db()
    .collection('users')
    .findOne({ _id: id })
    .then((user) => {
      done(null, user);
    });
});
passport.use(
  new GoogleStrategy(
    {
      //OPTIONS FOR GOOGLE STRATEGY
      callbackURL: '/auth/google/redirect',
      clientID: CLIENTID,
      clientSecret: CLIENTSECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      const db = await mongodb.getDb(); //get database
      //passport call back function
      console.log(db);

      db.db()
        .collection('users')
        .findOne({ googleId: profile.id })
        .then((currentUser) => {
          if (currentUser) {
            //already in database
            console.log('user is ', currentUser);
            // generate a token and attach it to the user object
            const token = jwt.sign({ id: currentUser.id }, process.env.SESSION_KEY);
            currentUser.token = token;

            done(null, currentUser);
          } else {
            //if not create user
            const user = { name: profile.displayName, googleId: profile.id };
            db.db()
              .collection('users')
              .insertOne(user)

              .then((newUser) => {
                //console.log(`new user ${profile.displayName} is saved`);
                //done(null, newUser);
                // generate a token and attach it to the user object
                const token = jwt.sign({ id: newUser.id }, process.env.SESSION_KEY);
                newUser.token = token;
                //console.log(newUser)
                done(null, newUser);
              });
          }
        });
    }
  )
);
