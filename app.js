// After (ES Modules)
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url'; 
import mongoDBConnect from './config/dbConnection.js';
import { EventEmitter } from 'events';

const __filename = fileURLToPath(import.meta.url);  // Get current file URL and convert it to file path
const __dirname = path.dirname(__filename);  // Get directory name from the file path
EventEmitter.defaultMaxListeners = 15;


import usersRouter from './routes/users.js';
import blogRouter from './routes/blog.js'
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersRouter);
app.use('/blog', blogRouter);

mongoDBConnect();
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

export default app;
