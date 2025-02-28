# File Management Application 

React (Vite) + Node.js + PostgreSQL application with Docker containerization.

## 🚀 Project Setup

1. Clone the repository
2. Create an `.env` file in the root directory:

```
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/files_db"
# API
VITE_API_URL="http://localhost:5000"
```

3. Install dependencies:

```
yarn install
```

4. Start the development environment:

```
# Start all services (frontend, backend, and database)
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

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

## 📁 File Storage

Files are stored locally in the `/uploads` directory. 
For production deployment, I would use cloud storage (AWS S3, Google Cloud Storage)

## 🐳 Additional Commands

Start services

```
docker-compose up
```

Rebuild and start

```
docker-compose up --build
```

Stop services

```
docker-compose down
```

Remove volumes - will delete database data

```
docker-compose down -v
```


