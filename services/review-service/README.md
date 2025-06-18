# Review Service

Manages user reviews, ratings, and book feedback.

## Features

- User book reviews and ratings
- Review moderation
- Rating aggregation
- Review analytics
- Spam detection

## API Endpoints

- `GET /reviews/book/:bookId` - Get reviews for a book
- `POST /reviews` - Submit a new review
- `PUT /reviews/:id` - Update user's review
- `DELETE /reviews/:id` - Delete user's review
- `GET /reviews/user/:userId` - Get user's reviews
- `POST /reviews/:id/helpful` - Mark review as helpful

## Technology Stack

- Node.js with Express
- MongoDB for review data
- Redis for caching
- Natural language processing for sentiment analysis
