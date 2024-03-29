import AppError from '../utils/app-error';

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const duplicateValuesArray = err.message.match(/(["'])(\\?.)*?\1/);
  if (duplicateValuesArray) {
    const value = duplicateValuesArray[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
  }
  return new AppError(err.message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const handleUnhandledError = () => {
  const error = new AppError('Something went very wrong!', 500);
  return {
    ...error,
    stack: error.stack,
  };
};

const handleValidationErrors = err => {
  if (process.env.NODE_ENV === 'development') {
    return {
      status: err.status,
      message: err.message,
      error: {
        ...err,
        stack: err.stack,
      },
    };
  }
  return {
    status: err.status,
    message: err.message,
  };
};

const handleValidationErrorsDB = (err, req, res) => {
  return Object.values(err.errors).map(el => {
    const error = new AppError(el.message, 400);
    return handleValidationErrors(error);
  });
};

const handleExpressValidationErrors = (err, req, res) => {
  return err.errors.map(el => {
    const error = new AppError(el.msg, 400);
    return handleValidationErrors(error);
  });
};

const sendValidationErrors = (err, req, res) => {
  return res.status(400).json(err);
};

const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
  });
};

const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak error details
  console.error('error:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

const errorHandler = (err, req, res, next) => {
  let error;

  // Handle and send validation errors
  if (err.name === 'ExpressValidationErrors') {
    error = handleExpressValidationErrors(err);
    return sendValidationErrors(error, req, res);
  }
  if (err.name === 'ValidationError') {
    error = handleValidationErrorsDB(err);
    return sendValidationErrors(error, req, res);
  }

  error = {
    ...err,
    message: err.message,
  };

  // Handle error depending on the type/name
  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
  if (!error.statusCode || !error.status || !error.message) error = handleUnhandledError();

  // Send error to the client
  if (process.env.NODE_ENV === 'development') {
    if (err.stack) error.stack = err.stack;
    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(error, req, res);
  }
};

export default errorHandler;
