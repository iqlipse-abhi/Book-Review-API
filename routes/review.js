const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { addReview } = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

// Add a review to a book (one per user per book)
router.post('/:id/reviews', protect, addReview);

module.exports = router;
