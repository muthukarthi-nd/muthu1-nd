var createError = require('http-errors');
var express = require('express');
// const cors = require('cors');
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

// app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:3000', 
//   credentials: true,
// }));

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




const PORT=process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
