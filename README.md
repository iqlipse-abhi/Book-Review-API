# Book Review API

A RESTful API built with **Node.js**, **Express**, **MongoDB**, and **JWT authentication**.  
It allows users to **sign up, log in, add books, submit reviews, update/delete reviews, and search books**.

---

## Features

- **User Authentication**: JWT-based signup & login
- **Books API**
  - Add a book (authenticated users only)
  - Get all books (pagination + filters: author, genre)
  - Get single book details (with average rating + paginated reviews)
- **Reviews API**
  - Add review to a book (one review per user per book)
  - Update/Delete your own review
- **Search API**
  - Search books by title or author (case-insensitive, partial match)

---

## Tech Stack

- **Node.js + Express** — backend framework  
- **MongoDB + Mongoose** — database  
- **JWT (jsonwebtoken)** — authentication  
- **bcrypt** — password hashing  
- **dotenv** — environment variables  
- **nodemon** — dev server auto-restart  

---

## Setup Instructions

### Clone & Install

```bash
git clone <your_repo_url>
cd book-review-api
npm install
```
### .env

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/bookreview
JWT_SECRET=your_super_secret_key
```

### Run Locally

```bash
// After updating the .env

npm i OR npm install
npm run dev OR npm start
```

## Authentication
- All protected routes require a JWT token in headers:
```bash
Authorization: Bearer <token>
```

## API Endpoints & Curls

```bash
API Endpoints

BASE_URL="http://localhost:5000/api"

# -------------------------
# 1. Signup
# -------------------------
echo "===== Signup ====="
curl -X POST "$BASE_URL/auth/signup" \
-H "Content-Type: application/json" \
-d '{
  "username": "alice",
  "email": "alice@example.com",
  "password": "password123"
}'
echo -e "\n"

# -------------------------
# 2. Login (get token)
# -------------------------
echo "===== Login ====="
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
-H "Content-Type: application/json" \
-d '{
  "email": "alice@example.com",
  "password": "password123"
}')
echo "$LOGIN_RESPONSE"
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
echo -e "\n"

# -------------------------
# 3. Add Book (auth required)
# -------------------------
echo "===== Add Book ====="
curl -X POST "$BASE_URL/books" \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "genre": "Fantasy"
}'
echo -e "\n"

# -------------------------
# 4. Get Books (with pagination + filters)
# -------------------------
echo "===== Get Books ====="
curl -X GET "$BASE_URL/books?page=1&limit=10&author=tolkien&genre=fantasy"
echo -e "\n"

# -------------------------
# 5. Get Book Details (with avg rating + reviews)
# -------------------------
BOOK_ID="<replace_with_book_id>"
echo "===== Get Book Details ====="
curl -X GET "$BASE_URL/books/$BOOK_ID"
echo -e "\n"

# -------------------------
# 6. Add Review (auth required)
# -------------------------
echo "===== Add Review ====="
curl -X POST "$BASE_URL/books/$BOOK_ID/reviews" \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "rating": 5,
  "comment": "Loved it!"
}'
echo -e "\n"

# -------------------------
# 7. Update Review (only owner)
# -------------------------
REVIEW_ID="<replace_with_review_id>"
echo "===== Update Review ====="
curl -X PUT "$BASE_URL/reviews/$REVIEW_ID" \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "rating": 4,
  "comment": "Changed my mind, still good."
}'
echo -e "\n"

# -------------------------
# 8. Delete Review (only owner)
# -------------------------
echo "===== Delete Review ====="
curl -X DELETE "$BASE_URL/reviews/$REVIEW_ID" \
-H "Authorization: Bearer $TOKEN"
echo -e "\n"

# -------------------------
# 9. Search Books by Title/Author
# -------------------------
echo "===== Search Books ====="
curl -X GET "$BASE_URL/search?query=harry"
echo -e "\n"
```

## Database Schema

**User**

```json
{
  "username": "String",
  "email": "String",
  "password": "String"
}
```

**Book**

```json
{
  "title": "String",
  "author": "String",
  "genre": "String",
  "description": "String",
  "reviews": ["ObjectId -> Review"]
}
```

**Review**

```json
{
  "user": "ObjectId -> User",
  "book": "ObjectId -> Book",
  "rating": "Number (1–5)",
  "comment": "String"
}

```

## Validation

- Only authenticated users can add books or reviews.
- Users can update/delete only their own reviews.
- Books can be filtered and paginated when listing all books.
- Reviews are included in the book details endpoint with average rating.
- Passwords are hashed using bcrypt, and authentication is handled with JWT tokens.
  


