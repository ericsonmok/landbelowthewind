var user = require('../model/user');
var passport = require('passport');

let loginController = {
  signup: (req, res, done) => {
    console.log(req.user)
  var newSignUpStrategy = passport.authenticate('signup', {
    successRedirect : '/admin',
    failureRedirect : '/signup'
  });
  return newSignUpStrategy(req, res, done);
},

login:(req, res, done) => {
  var newLogInStrategy = passport.authenticate('login', {
    successRedirect: '/admin',
    failureRedirect: '/login'
  });
  return newLogInStrategy(req,res,done);
}

};
module.exports = loginController;
