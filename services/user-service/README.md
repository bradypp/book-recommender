# User Service

Handles user authentication, authorization, and profile management.

## Features

- User registration and login
- JWT token management
- Profile CRUD operations
- Password reset functionality

## API Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `POST /auth/forgot-password` - Password reset

## Technology Stack

- Node.js with Express
- MongoDB for user data
- JWT for authentication
- bcrypt for password hashing
