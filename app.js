// After (ES Modules)
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url'; 
import mongoDBConnect from './config/dbConnection.js';
import { EventEmitter } from 'events';
import errorHandler from './middlewares/errorHandler.js';
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
// Ensure errors are returned as JSON
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});


// Handle Undefined Routes (404)
app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global Error Handler (Must Be Last Middleware)
app.use(errorHandler);

export default app;
