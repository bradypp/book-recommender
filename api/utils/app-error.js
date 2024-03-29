class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // True if an operational error and whether the error should be sente to the client
    this.isOperational = true;

    // Shows where in the code the error happened
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
