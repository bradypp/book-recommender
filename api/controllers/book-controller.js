const Book = require('../models/book-model');
const AppError = require('../utils/app-error');
const { catchAsync } = require('../utils/helpers');
const QueryHandler = require('./query-handler');

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
