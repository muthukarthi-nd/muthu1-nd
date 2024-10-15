var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var connectDB=require('./config/db');
var dataRoute=require('./route/transRoute');
var usersRouter = require('./route/userRoute');
const registerRoutes = require('./route/regloginroutes');


var app = express();
connectDB();

// Middleware
app.use(bodyParser.json());

app.use(cors());

// route
app.use('/api/v1', usersRouter);
app.use('/api/v1', dataRoute);
app.use('/user/v2', registerRoutes);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const PORT=process.env.PORT;
app.listen(PORT,()=>{
console.log('server connected port 5000')
});

module.exports = app;
