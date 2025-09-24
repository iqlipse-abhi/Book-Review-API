const express = require('express');
const { searchBooks } = require('../controllers/bookController');

const router = express.Router();

// GET /api/search?query=harry
router.get('/search', searchBooks);

module.exports = router;
