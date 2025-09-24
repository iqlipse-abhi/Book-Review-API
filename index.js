require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book');
const reviewRoutes = require('./routes/review');
const reviewStandaloneRoutes = require('./routes/reviewStandalone')
const searchRoutes = require('./routes/search');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);

app.use('/api/books', bookRoutes);

app.use('/api/books', reviewRoutes);

app.use('/api', reviewStandaloneRoutes);

app.use('/api/search', searchRoutes);

app.get('/', (req, res) => res.send('Book Review API is running'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));