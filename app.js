require('dotenv').config({ silent: true })
var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var flash = require('express-flash');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var passport = require('passport');
var session = require('express-session');
var methodOverride = require('method-override');
// var db = monk('localhost:27017/landbelowthewind');
// import dotenv from 'dotenv';
// dotenv.load(path: '.env');

var mongodb = require('mongodb');

//mongoose.connect(process.env.MONGODB_URI);

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var signup = require('./routes/signup');

var app = express();

mongoose.connect('mongodb://localhost/landbelowthewind', function(err,db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server.', err);
  } else {
    console.log('Connection established to mongodb://localhost/landbelowthewind');
  }
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Setup Sessions
app.use(session({secret: 'iloveui'}));
app.use(passport.initialize());
app.use(passport.session());
// Setup local strategy
require('./config/passport')(passport);

// flash
app.use(flash());

// Method Override for http methods (allow PUT)
app.use(methodOverride('_method'));

// view engine setup
app.set('port', 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



app.use('/', index);
app.use('/admin', users);
app.use('/login', login);



// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// listen
const port = 5000;
app.listen(port, function() {
  console.log('Running on port ' + port);
})

module.exports = app;
