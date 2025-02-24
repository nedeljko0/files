# Full Stack Application

React (Vite) + Node.js + PostgreSQL application with Docker containerization.

## 🚀 Quick Start

### Prerequisites:

- Docker
- Docker Compose

## Development

- Hot reloading enabled for frontend and backend
- Node modules persisted in Docker volumes
- API requests proxied through `/api` endpoint

## 🛠 Tech Stack

### Frontend

- React 18 + TypeScript + Vite
- Port: 3000

### Backend

- Node.js + Koa
- Port: 5000

### Database

- PostgreSQL 13
- Credentials:

```
  - User: postgres
  - Password: postgres
  - Database: files_db
```

## 🐳 Docker Commands

Start services
docker-compose up

Rebuild and start
docker-compose up --build

Stop services
docker-compose down

Remove volumes
docker-compose down -v

View logs
docker-compose logs [service]
