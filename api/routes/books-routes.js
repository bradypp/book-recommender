import express from 'express';

import booksController from '../controllers/books-controller';

const router = express.Router({ mergeParams: true });

router.get('/', booksController.getBooks);
router.get('/search', booksController.getSearchedForBooks);
router.get(
  '/related',
  booksController.getBookDataFromIds,
  booksController.prepareRelatedBooksSearch,
  booksController.getBooks,
);
router.get('/recommended', booksController.getBookDataFromIds, booksController.getRecommendedBooks);
router.get('/genres', booksController.getGenres);

export default router;
