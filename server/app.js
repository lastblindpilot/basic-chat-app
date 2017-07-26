'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

let app = express();

app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use('/', express.static(path.join(__dirname, '../dist')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.error('App error: ', err.message, err.stack);
  let error = (app.get('env') === 'development') ? err : {};
  res.render('error', {
    message: err.message,
    error: error
  });
});

module.exports = app;