import Book from '../models/book-model';
import AppError from '../utils/app-error';
import { catchAsync } from '../utils/helpers';

const getBookData = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  req.bookData = book;
  next();
});

const sendBookData = (req, res, next) => {
  const { bookData } = req;
  if (!bookData) {
    return next(new AppError('No book found with that id!', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      book: bookData,
    },
  });
};

export default {
  getBookData,
  sendBookData,
};
