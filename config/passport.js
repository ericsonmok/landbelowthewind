// Import strategies
var localStrategy = require('passport-local').Strategy;

// Import validator
var validator = require('validator');

// Import models
var User = require('../model/user');

module.exports = function(passport) {

  // Serialize user
  passport.serializeUser(function(user, done){
      done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(function(id, done){
      User.findById(id, function(err, user){
        done(err, user); // deserialize the user and store into req.user
      });
  });

    // Passport Local Sign Up
    passport.use('signup', new localStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback: true
      },
      function(req, email, password, done){    // function is run because of passReqToCallback:true
          // Check that the email is in the right format
          if( !validator.isEmail(email) ){
            return done(null, false, req.flash('errors',{msg:'That is not a valid email address'}));
          }

          // Check that the password is at least 8 chars
          if( password.length < 8 ){
            return done(null, false, req.flash('errors',{msg:'Password needs to be at least 8 chars long'}));
          }

          // Asynchronous function to check if email already exists in DB, if not, create and log in new user
          process.nextTick(function(){
            User.findOne( {'email' : email }, function(err, user){
              if(err){
                return done(err);
              }
              if(user){
                return done(null, false, req.flash('errors',{msg:'That email is already in use'}));
              }else{

                var newUser = new User();
                newUser.email = email;
                newUser.password = password;


                newUser.save(function(err){
                  if(err){
                    console.log(err);
                  }
                  return done(null, newUser, req.flash('success', {msg:'Logged in successfully'}));
                });
              }
            });
          });
      }));
      // Passport Local Login
  passport.use('login', new localStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback: true
    },
    function(req, email, password, done){
        process.nextTick(function(){
          User.findOne( {'email' : email }, function(err, user){
            if(err){
              return done(err);
            }
            if(!user){
              return done(null,false, req.flash('errors', {msg:'Sorry, there is no one by that email'}));
            }

            user.validPassword(password, function(err, isMatch){

              if(isMatch){
                return done(null, user, req.flash('success', {msg:'Logged in successfully'}));
              }

              return done(null,false, req.flash('errors', {msg:'Sorry, you have keyed in a wrong password'}));
            })
          });
        });
    }));
};

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  const token = req.user.tokens.find(token => token.kind === provider);
  if (token) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};
