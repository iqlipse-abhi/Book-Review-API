const Book = require('../models/Book');
const Review = require('../models/Review');

const addBook = async (req, res, next) => {
  try {
    const { title, author, genre, description } = req.body;
    if (!title || !author) {
      return res.status(400).json({ message: 'Title and Author required' });
    }
    const book = await Book.create({ title, author, genre, description });
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

const getBooks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;
    const query = {};
    if (author) query.author = new RegExp(author, 'i');
    if (genre) query.genre = new RegExp(genre, 'i');

    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Book.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      books
    });
  } catch (err) {
    next(err);
  }
};


const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 5 } = req.query;

    const book = await Book.findById(id).populate('reviews');
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const reviews = await Review.find({ book: id })
      .populate('user', 'username email')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const avgRating = await Review.aggregate([
      { $match: { book: book._id } },
      { $group: { _id: '$book', avgRating: { $avg: '$rating' } } }
    ]);

    res.json({
      ...book.toObject(),
      averageRating: avgRating.length ? avgRating[0].avgRating : null,
      reviews
    });
  } catch (err) {
    next(err);
  }
};

const searchBooks = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const regex = new RegExp(query, 'i'); // case-insensitive
    const books = await Book.find({
      $or: [{ title: regex }, { author: regex }]
    });

    res.json({ total: books.length, books });
  } catch (err) {
    next(err);
  }
};

module.exports = { addBook, getBooks, getBookById, searchBooks };
