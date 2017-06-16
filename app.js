var express = require('express');
var favicon = require('serve-favicon');
var logger = require('winston');
var path = require('path')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var expressHbs = require('express-handlebars');

var index = require('./routes/index-routes');
var scrape = require('./routes/scrape-routes.js');
var article = require('./routes/article-routes.js');

var app = express();

// view engine setup
app.engine("handlebars", expressHbs({
    defaultLayout: "main"
}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Database configuration with mongoose
mongoose.connect("mongodb://heroku_8p99fqsd:phbvm32j6dhus1ppu88v33f5il@ds127842.mlab.com:27842/heroku_8p99fqsd");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

app.use('/', index);
app.use('/scrape',scrape);
app.use('/article',article);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;