// Handle any uncaught ex
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION!');
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  } else {
    console.error(err.name, err.message);
  }
});

const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const rateLimiter = require('./config/rateLimiter');
const connectDB = require('./config/db');
const bookRouter = require('./routes/bookRoutes');
const errorHandler = require('./controllers/errorHandler.js');

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
