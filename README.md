# 📊 Analytics API

A production-ready Node.js + Express analytics API that provides daily and hourly metrics with caching, rate limiting, authentication, and Dockerized deployment.

---

## 🚀 Project Overview

The Analytics API provides:

- 📅 Daily metrics aggregation
- ⏰ Hourly metrics aggregation
- ⚡ Intelligent caching layer
- 🛡 API key authentication
- 🚦 Rate limiting protection
- 🧪 Comprehensive unit and integration tests
- 🐳 Fully Dockerized setup

This project demonstrates production-level backend architecture, testing, and deployment configuration.

---

# 🏗 Tech Stack

- Node.js
- Express.js
- Redis (caching & rate limiting)
- Jest (testing)
- Docker & Docker Compose

---

# ⚙️ Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Akulamadhumitha/Analytics_Api
cd Analytics_Api
```
## 2️⃣ Configure Environment
```bash
Create a .env file (or copy from .env.example):

cp .env.example .env
Example .env:

PORT=8080
API_KEY=your_super_secret_api_key_123
REDIS_URL=redis://localhost:6379
CACHE_TTL_SECONDS=300
RATE_LIMIT_REQUESTS=5
RATE_LIMIT_WINDOW_SECONDS=30
```
## 3️⃣ Build Docker Containers
```bash
docker-compose build
```
## 4️⃣ Start Application
```bash
docker-compose up
API will be available at:

http://localhost:8080
```
## 🧪 Running Tests
### Run tests inside Docker:
```bash
docker-compose run analytics-api npm test
```
This executes:

- Unit Tests

- Integration Tests

- Cache behavior tests

- Rate limiting tests

- Authentication tests

---

## 📡 API Endpoints
### Base URL:
```bash
http://localhost:8080/api/v1/metrics
```
All endpoints require:

X-API-Key: supersecretkey

---

## 📅 GET /daily
### Retrieve daily aggregated metrics.

Query Parameters
| Parameter | Required | Format | Description |
|------------|----------|--------|-------------|
| start_date | No | YYYY-MM-DD | Start date |
| end_date | No | YYYY-MM-DD | End date |

Example Request
```bash
curl -H "X-API-Key: supersecretkey" \
"http://localhost:8080/api/v1/metrics/daily?start_date=2025-01-01&end_date=2025-01-10"
```
Example Response
```json
{
  "status": "success",
  "count": 10,
  "data": [
    {
      "date": "2025-01-01",
      "users_active": 120,
      "page_views": 3000,
      "revenue": 540.25
    }
  ]
}
```
### Possible Status Codes
- 200 OK

- 400 Bad Request (invalid date format)

- 401 Unauthorized (missing/invalid API key)

- 429 Too Many Requests

- 500 Internal Server Error

---

## ⏰ GET /hourly
Retrieve hourly aggregated metrics.

Same query parameters as /daily.

## 🧹 POST /cache/invalidate
### Invalidate entire cache.

Example
```bash
curl -X POST \
-H "X-API-Key: supersecretkey" \
http://localhost:8080/api/v1/metrics/cache/invalidate
```
Response:

```json
{
  "status": "success",
  "message": "Cache invalidated successfully"
}
```

## 🏛 Architectural Overview
### 🔹 Backend Architecture
The project follows a modular layered structure:

src/
 ├── routes/
 ├── services/
 ├── middleware/
 ├── config/
 └── tests/
Separation of concerns:

- Routes → HTTP handling

- Services → Business logic

- Middleware → Auth & rate limiting

- Config → Redis setup

---

## 🔹 Caching Strategy
- Redis-based distributed caching

- In-memory fallback for test environment

- Deterministic cache keys using request URL

- Configurable TTL via environment variables

Cache behavior tested:

- First request → MISS

- Subsequent request → HIT

- Cache invalidation resets state

---

## 🔹 Rate Limiting Algorithm
- Redis-based counter using INCR

- Time-window based throttling

- Configurable limit & window

- Returns 429 Too Many Requests when exceeded

- Fallback memory limiter if Redis unavailable

---

## 🔹 Authentication
Simple API Key validation using middleware.

All protected endpoints require:

X-API-Key header

---

## 🌎 Environment Variables

| Variable | Description | Example |
|----------|------------|----------|
| PORT | Application port | 8080 |
| API_KEY | API authentication key | your_super_secret_api_key_123 |
| REDIS_URL | Redis connection string | redis://redis:6379 |
| CACHE_TTL_SECONDS | Cache expiry time (seconds) | 300 |
| RATE_LIMIT_REQUESTS | Maximum requests per window | 5 |
| RATE_LIMIT_WINDOW_SECONDS | Rate limit window duration (seconds) | 30 |


---

## 🐳 Docker Configuration
The application runs in a multi-container setup:

- analytics-api (Node service)

- redis (caching & rate limiting)

---

## 📦 Optimized Multi-Stage Dockerfile

```dockerfile
# Use official Node image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Start application
CMD ["npm", "start"]

```
Benefits:

- Smaller image size

- Faster deployment

- Cleaner runtime container

---

## 🧠 Key Design Decisions
- Docker-first development

- Redis-backed distributed systems approach

- Test-driven structure

- Clean middleware separation

- Environment-based configuration

## ✅ Test Coverage Summary
✔ Unit tests for:

- Metrics service

- Cache service

- Rate limiting logic

- Input validation

✔ Integration tests for:

- All endpoints

- Cache behavior

- Rate limiting

- Authentication

✔ All tests pass inside Docker environment

---

## 🏁 Conclusion
This Analytics API demonstrates:

- Production-ready architecture

- Performance optimization

- Distributed caching

- Secure API practices

- Comprehensive testing

- Dockerized deployment
