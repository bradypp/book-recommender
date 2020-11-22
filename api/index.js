import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import helmet from 'helmet';
import morgan from 'morgan';

import AppError from './utils/app-error';
import rateLimiter from './config/rate-limiter';
import connectDB from './config/db';
import bookRouter from './routes/book-routes';
import booksRouter from './routes/books-routes';
import errorHandler from './controllers/error-handler.js';

// Handle any uncaught ex
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION!');
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  } else {
    console.error(err.name, err.message);
  }
});

// Create express instance
const app = express();

// Set security HTTP headers
app.use(helmet());

// Logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting middlewares
if (process.env.NODE_ENV === 'production') {
  app.use('/', rateLimiter({ maxAttempts: 200, windowMinutes: 15 }));
}

// Body-parsing & cookie parsing middlewares
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection & XSS
app.use(mongoSanitize());
app.use(xss());

// Import API Routes
app.use('/book', bookRouter);
app.use('/books', booksRouter);

// Unhandled route handler
app.all('*', (req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)),
);

// Global error handling middleware
app.use(errorHandler);

connectDB();

// Export express app
module.exports = app;

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
}

// Final error handling safety net
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION!');
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  } else {
    console.error(err.name, err.message);
  }
});
