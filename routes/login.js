var express = require('express');
var router = express.Router();
import User from '../model/user';

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

router.post('/', (req, res, next) => {

  const email = req.body.username;
  const password = req.body.password;

  User.find({email: email}, (err, users) => {
      if(err){
        res.render('login', {
          title: 'Login'
        });
      }else{

          users[0].comparePassword(password, (err, isMatch) =>{

              if(isMatch){
                  res.redirect('/secret');
              }else{
                res.render('login', {
                  title: 'Login'
                });
              }

          });


      }
  });
});

router.get('/signup', (req, res, next) => {
  res.render('signup', {
    title: 'Signup'
  });
});

router.post('/signup', (req, res, next) => {

  const email = req.body.username;
  const password = req.body.password;

  const user = new User({
      email: email,
      password: password
  });
  user.save((err, user) => {

    console.log('User save');

    if(err){
      console.log(err);
      res.render('signup', {
        title: 'Signup'
      });
    }
    res.redirect('/login');
  });
});

router.get('/admin', (req, res, next) => {
  res.render('admin', {
    title: 'Admin'
  });
});

module.exports = router;
