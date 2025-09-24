const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { updateReview, deleteReview } = require('../controllers/reviewController');

const router = express.Router();

// Update review
router.put('/reviews/:id', protect, updateReview);

// Delete review
router.delete('/reviews/:id', protect, deleteReview);

module.exports = router;