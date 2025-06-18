# Book Service

Manages book catalog, metadata, and search functionality.

## Features

- Book catalog management
- Book metadata (title, author, genre, ISBN, etc.)
- Search and filtering capabilities
- Book availability tracking

## API Endpoints

- `GET /books` - List books with pagination and filters
- `GET /books/:id` - Get book details
- `POST /books` - Add new book (admin)
- `PUT /books/:id` - Update book (admin)
- `DELETE /books/:id` - Remove book (admin)
- `GET /books/search` - Search books by title, author, genre

## Technology Stack

- Node.js with Express
- PostgreSQL for book data
- Elasticsearch for search functionality
- Redis for caching
