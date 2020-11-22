import express from 'express';

import bookController from '../controllers/book-controller';
import booksRouter from './books-routes';

const router = express.Router();

router.use('/:id/books', bookController.getBookData, booksRouter);

router.get('/:id', bookController.getBookData, bookController.sendBookData);

export default router;
