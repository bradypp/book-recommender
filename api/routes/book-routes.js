import express from 'express';

import * as bookController from '../controllers/book-controller';

const router = express.Router();

router.get('/all', bookController.getAllBooks);
router.get('/search', bookController.getSearchedForBooks);
router.get('/related', bookController.prepareRelatedBooksSearch, bookController.getAllBooks);
router.get('/recommended', bookController.getRecommendedBooks);

export default router;
