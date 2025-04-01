# UploadSoul Backend Services

This repository contains the backend services for the UploadSoul platform, an AI-powered digital companion system.

## Architecture

The backend is built as a set of microservices:

1. **Auth Service** - Handles multi-method authentication (email/password, phone, OAuth)
2. **Voice Service** - Processes voice input and detects emotions
3. **API Gateway** - Routes requests to appropriate services

## Prerequisites

- Docker and Docker Compose
- Git
- Make (optional, for using Makefile commands)

## Quick Start

1. Clone this repository:



2. Copy the environment file template:



3. Start the services:



4. Access services:
   - Auth Service API: http://localhost:8001
   - API Gateway: http://localhost:8000
   - PgAdmin (dev mode only): http://localhost:5050

## Service Details

### Auth Service

The authentication service provides:

- Email/password authentication
- Phone number authentication with SMS verification
- OAuth2 authentication (Google, Facebook, WeChat, Apple)
- JWT token management
- Rate limiting and security features

API endpoints are available at:
- `/api/v1/auth/register/email` - Register with email
- `/api/v1/auth/register/phone` - Register with phone number
- `/api/v1/auth/login/email` - Login with email/password
- `/api/v1/auth/login/phone` - Login with phone verification
- `/api/v1/auth/oauth/{provider}` - OAuth2 authentication
- `/api/v1/auth/refresh-token` - Refresh access token

See the service's API documentation for more details.

### Voice Service

The voice service is responsible for:

- Processing voice input
- Detecting emotions from voice
- Voice-to-text conversion
- Text-to-voice response generation

## Development

### Environment Setup

For development, you can use the dev profile:



This will start PgAdmin for database management.

### Adding New Services

To add a new service:

1. Create a new directory for the service
2. Add the service configuration to docker-compose.yml
3. Create a Dockerfile and required application files
4. Update the API Gateway configuration if necessary

### Database Migrations

Database migrations are managed with Alembic:



## Testing

Run tests for all services:



## Deployment

For production deployment:

1. Set appropriate environment variables
2. Use production-ready database credentials
3. Enable TLS for all services



## License

This project is proprietary and confidential, owned by MGX.AI.