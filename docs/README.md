# PrivHealthAI

AI-powered healthcare platform — search doctors worldwide, analyse symptoms, and chat with an AI healthcare assistant.

## Quick Start

### Prerequisites
- Java 21, Maven 3.9+
- Node.js 20+, npm 10+
- PostgreSQL 15+

### Backend

```bash
# 1. Create database
psql -U postgres -c "CREATE DATABASE privhealthai;"

# 2. Copy and configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your DB credentials

# 3. Run (from PrivHealthAI/backend/)
cd backend
mvn spring-boot:run

# Backend: http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui/index.html
# Actuator: http://localhost:8080/actuator/health
```

### Frontend

```bash
cd frontend
npm install
npm run dev

# Frontend: http://localhost:5173
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4 |
| State | Redux Toolkit |
| Backend | Java 21, Spring Boot 3.3 |
| Security | Spring Security + JWT (JJWT 0.12) |
| Database | PostgreSQL + Flyway |
| API Docs | SpringDoc OpenAPI (Swagger UI) |
| AI Service | Python / FastAPI (future) |

## Project Structure

```
PrivHealthAI/
├── backend/     Spring Boot application
├── frontend/    React + Vite application
└── docs/        Architecture and documentation
```
