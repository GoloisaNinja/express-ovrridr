const createError = require('http-errors');
const express = require('express');
const path = require('path');
const connectDB = require('./db/db.js');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const dashboardRouter = require('./routes/dashboard');

// partial path
const partialsPath = path.join(__dirname, './partials');

const app = express();
connectDB().catch((error) => {
  console.log('oops...db error')
  console.table(error);
})
// partials
hbs.registerPartials(partialsPath);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
 // res.status(err.status || 500);
  res.status(404)
  res.render('error', {
    title: 'Ovridr Whoopsie',
    cssPath: '/stylesheets/style.css',
    url: req.url,
  });
});

module.exports = app;
