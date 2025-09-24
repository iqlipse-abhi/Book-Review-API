const Review = require('../models/Review');
const Book = require('../models/Book');

// Add review (already done earlier)
const addReview = async (req, res, next) => {
  try {
    const { id: bookId } = req.params;
    const { rating, comment } = req.body;

    const existing = await Review.findOne({ user: req.user._id, book: bookId });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this book' });
    }

    const review = await Review.create({
      user: req.user._id,
      book: bookId,
      rating,
      comment
    });

    await Book.findByIdAndUpdate(bookId, { $push: { reviews: review._id } });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

// Update review
const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    review.rating = req.body.rating ?? review.rating;
    review.comment = req.body.comment ?? review.comment;
    await review.save();

    res.json(review);
  } catch (err) {
    next(err);
  }
};

// Delete review
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();

    // remove reference from Book
    await Book.findByIdAndUpdate(review.book, { $pull: { reviews: review._id } });

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { addReview, updateReview, deleteReview };
