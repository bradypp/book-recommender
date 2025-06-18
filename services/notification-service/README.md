# Notification Service

Handles email notifications, push notifications, and communication with users.

## Features

- Email notifications
- Push notifications
- SMS notifications (optional)
- Notification templates
- Delivery tracking
- User notification preferences

## API Endpoints

- `POST /notifications/email` - Send email notification
- `POST /notifications/push` - Send push notification
- `GET /notifications/user/:userId` - Get user notifications
- `PUT /notifications/:id/read` - Mark notification as read
- `POST /notifications/preferences` - Update user preferences

## Technology Stack

- Node.js with Express
- MongoDB for notification logs
- SendGrid/AWS SES for email
- Firebase Cloud Messaging for push notifications
- Bull Queue for background processing
