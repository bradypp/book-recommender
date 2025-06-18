# API Gateway

Central API gateway for routing requests to appropriate microservices.

## Features

- Request routing and load balancing
- Authentication and authorization
- Rate limiting and throttling
- Request/response logging
- API versioning
- CORS handling
- Health checks

## Routes

- `/api/v1/auth/*` → User Service
- `/api/v1/books/*` → Book Service
- `/api/v1/recommendations/*` → Recommendation Service
- `/api/v1/reviews/*` → Review Service
- `/api/v1/notifications/*` → Notification Service

## Technology Stack

- Node.js with Express
- nginx for load balancing
- Redis for rate limiting
- JWT for authentication
- Winston for logging
