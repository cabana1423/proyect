var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var restRouter = require('./routes/Restaurant');
var menuRouter = require('./routes/MenuRest');
var userRouter = require('./routes/User');
var imgRouter = require('./routes/img_rest');
var imgmenuRouter = require('./routes/img_menu');
var pedidoRouter = require('./routes/Pedido');
var facRouter = require('./routes/Facturas');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api_v1.0', restRouter);
app.use('/api_v1.0', menuRouter);
app.use('/api_v1.0', userRouter);
app.use('/api_v1.0', imgRouter);
app.use('/api_v1.0', imgmenuRouter);
app.use('/api_v1.0', pedidoRouter);
app.use('/api_v1.0', facRouter);

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
var port = 8000;
app.listen(port, () => {
  console.log("Corriendo " + port);
});

module.exports = app;
