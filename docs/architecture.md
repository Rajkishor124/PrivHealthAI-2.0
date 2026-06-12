# PrivHealthAI — System Architecture

## Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Client Browser                       │
│              React 19 + Vite + Tailwind CSS              │
│                Redux Toolkit + React Router              │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP / REST (Axios)
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  Spring Boot 3.3 Backend                  │
│                  Java 21 · Port 8080                     │
│                                                          │
│  ┌─────────┐  ┌───────────┐  ┌─────────┐  ┌────────┐  │
│  │  Auth   │  │  Doctors  │  │  Users  │  │ Admin  │  │
│  └────┬────┘  └─────┬─────┘  └────┬────┘  └───┬────┘  │
│       │             │              │             │       │
│  ┌────▼─────────────▼──────────────▼─────────────▼───┐  │
│  │            Spring Data JPA + Hibernate             │  │
│  └────────────────────────┬───────────────────────────┘  │
│  ┌─────────────────────────▼──────────────────────────┐  │
│  │     Flyway Migration Manager (schema versioning)    │  │
│  └─────────────────────────┬──────────────────────────┘  │
└─────────────────────────────┼───────────────────────────┘
                              │ JDBC
┌─────────────────────────────▼───────────────────────────┐
│                     PostgreSQL 15+                       │
│                Tables: users, doctors                    │
└─────────────────────────────────────────────────────────┘

                   [Future — AI Service]
┌─────────────────────────────────────────────────────────┐
│               Python · FastAPI · Port 8001               │
│         Scikit-Learn · Gemini API · LangChain            │
│                                                          │
│  POST /assess   — symptom risk assessment                │
│  POST /chat     — AI healthcare chatbot                  │
└─────────────────────────────────────────────────────────┘
```

## Security Architecture

```
Request → JwtAuthenticationFilter
            ↓
        Extract Bearer token
            ↓
        JwtService.validateToken()
            ↓
        SecurityContextHolder.setAuthentication()
            ↓
        SecurityConfig (permit-all for MVP bootstrap)
```

## Package Structure (Backend)

```
com.privhealthai
├── auth          Login, register, JWT issuance
├── user          Patient profile management
├── doctor        Doctor search and profiles
├── assessment    AI symptom analysis (future)
├── chatbot       AI healthcare chat (future)
├── admin         Platform administration
├── security      JWT filter, service, config
├── config        OpenAPI, JPA auditing, app config
├── common        Shared DTOs (ApiResponse, PageResponse)
├── exception     Global error handling
└── mapper        Entity-DTO mappers (future MapStruct)
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | /api/auth/register | Register new patient |
| POST | /api/auth/login | Login, get JWT |
| GET | /api/doctors | List doctors (paginated) |
| GET | /api/doctors/{id} | Doctor profile |
| GET | /api/users/{id} | User profile |
| GET | /api/assessment/ping | Assessment module status |
| GET | /api/chatbot/ping | Chatbot module status |
| GET | /api/admin/ping | Admin module status |
| GET | /actuator/health | Service health |
| GET | /swagger-ui/index.html | Swagger UI |

## Future AI Service Integration

The AI Service will be a separate Python microservice communicating with the Spring Boot backend over HTTP. The Spring Boot backend will proxy AI requests internally — the React frontend never calls the AI service directly.

Integration points prepared:
- `assessment` package — receives symptoms, calls AI service
- `chatbot` package — proxies messages to AI service
- `GEMINI_API_KEY` in `.env.example` — ready for configuration
