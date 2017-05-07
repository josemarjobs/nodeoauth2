var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport')
const engine = require('ejs-locals');
const session = require('express-session');

var database = require('./config/database');

var app = express()

app.engine("ejs", engine);
app.set('view engine', 'ejs')

app.use(logger("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")))

app.use(session({
  secret: 'some really secure secret',
  resave: true,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session())

database.connect();

var routes = require('./config/routes');
app.use('/', routes)

app.use((req, res, next) => {
  var err = new Error("Not Found");
  err.status = 404;
  next(err)
})

app.listen(3000);