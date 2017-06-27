var express = require('express');
var router = express.Router();
var loginController = require('../controllers/loginController');
var normalUserController = require('../controllers/normalUserController');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Land Below the Wind' });
});

/* GET sign up page. */
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Signup' });
});

/* POST for signup form */
router.post('/signup', loginController.signup);

/* POST for login form */
router.post('/login', loginController.login);

/* GET admin post-login page. */
router.get('/admin', normalUserController.renderLogin);



module.exports = router;
