var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config'); // get our config file
var cors = require('cors');

//var cors = require('./cors'); // get our config file
// Model path
var mongoose = require('mongoose');
//  'mongodb://127.0.0.1:27017/test'
mongoose.connect(process.env.MONGOLAB_URI || config.database, function (error) {
   if (error) console.error(error);
   else console.log('mongo connected');
});
var jwt = require('jsonwebtoken');

var app = module.exports = express();






app.set('superSecret', config.secret); // secret variable

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
//app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



var url = require('./routes/url.js');

app.use(function (req, res, next) {

    // Website you wish to allow to connect
res.header('access-control-allow-origin', '*');
  res.header('access-control-allow-methods', 'GET, POST, PUT, DELETE');
  res.header('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');

    // Pass to next layer of middleware
    next();
});

app.use('/', url);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({ "status": "Error", "message": err.message, "error": err });
    });
}



// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({ "status": "Error", "message": err.message,  "error": err });
});

app.use(function (err, req, res, next) {
    res.send({ "status": "Error", "message": err.message,  "error": err });
});

app.listen(3000);

module.exports = app;
