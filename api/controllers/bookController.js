const Book = require('../models/bookModel');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/helpers');
const QueryHandler = require('./queryHandler');

exports.getAllBooks = catchAsync(async (req, res, next) => {
  const handler = new QueryHandler(Book.find(), req.query).filter().sort().limitFields().paginate();

  // const doc = await handler.query.explain();
  const doc = await handler.query;
  if (!doc) {
    return next(new AppError('No books found', 404));
  }

  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      books: doc,
    },
  });
});
