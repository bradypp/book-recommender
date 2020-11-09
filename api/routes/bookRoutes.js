const express = require('express');

const bookController = require('../controllers/bookController');

const router = express.Router();

router.get('/all', bookController.getAllBooks);

module.exports = router;
