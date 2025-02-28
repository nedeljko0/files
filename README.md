# File Management App 

React (Vite) + Node.js + PostgreSQL application with Docker containerization.

## 🚀 Project Setup

1. Clone the repository
2. Create an `.env` file in the root directory:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/files_db"
VITE_API_URL="http://localhost:5000"
```

3. Build and start the application:

```
docker-compose up --build 
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


