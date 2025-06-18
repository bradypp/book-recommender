# Recommendation Service

AI-powered book recommendation engine based on user preferences and behavior.

## Features

- Personalized book recommendations
- Collaborative filtering algorithms
- Content-based filtering
- Machine learning model training
- Recommendation analytics

## API Endpoints

- `GET /recommendations/:userId` - Get personalized recommendations
- `POST /recommendations/feedback` - Record user feedback on recommendations
- `GET /recommendations/trending` - Get trending books
- `POST /recommendations/retrain` - Trigger model retraining (admin)

## Technology Stack

- Python with FastAPI
- TensorFlow/PyTorch for ML models
- PostgreSQL for user interaction data
- Redis for caching recommendations
- Celery for background tasks
