
const passport = require("passport");
const { v4: uuidv4 } = require('uuid');

// const user = require("./")

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: "573107347042-ptgrj9v6g5fcoden848gpivrql1h2fe0.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3500/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
  // let email = profile._json.email
  // user= new userModel {
  //   ElementInternals
  //   passs : uunid()
  // }
  // user.save()
  // console.log(email)
    console.log(profile,"userss");
    // console.log(profile)
    return cb(null, "user");
  }
));


module.exports={passport};