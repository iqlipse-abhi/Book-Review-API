const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { addBook, getBooks, getBookById } = require('../controllers/bookController');

const router = express.Router();

// Add new book (protected)
router.post('/', protect, addBook);

// Get all books (pagination + filters)
router.get('/', getBooks);

// Get single book details (with avg rating + reviews)
router.get('/:id', getBookById);

module.exports = router;
