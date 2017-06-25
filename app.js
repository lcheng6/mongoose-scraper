var express = require('express');
var favicon = require('serve-favicon');
var logger = require('winston');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var exphbs = require("express-handlebars");

var index = require('./routes/index-routes');
var scrape = require('./routes/scrape-routes.js');
var article = require('./routes/article-routes.js');

var app = express();
// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + "/public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: "application/vnd.api+json"}));

// Static directory
app.use(express.static("public"));


app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");


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