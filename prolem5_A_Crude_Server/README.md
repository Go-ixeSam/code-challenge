# 📚 Project Overview

## 🧠 Why This Architecture (NestJS, Modules, Repository, DTO, Entity)

This project uses **NestJS** because it provides a clean, structured, and scalable architecture — something that would be much harder to maintain if built directly on ExpressJS. NestJS offers modules, controllers, services, dependency injection, and a consistent application lifecycle, helping the codebase remain organized even as features grow.

Within this structure, the **Netflix Shows module** follows a clear and standard layered pattern.  
Its folder layout reflects how responsibilities are separated:

```
src/common/netflix-shows
├── dto/               → Input validation & request shaping (Create, Update, Query DTOs)
├── entities/          → Database model (`NetflixShow` entity)
├── common/base/       → Shared repository + service utilities
├── interceptors/      → Additional module-level interceptors (if any)
├── interfaces/        → Type definitions used internally
├── netflix-shows.controller.ts   → Defines all HTTP endpoints
├── netflix-shows.service.ts      → Business logic layer
└── netflix-shows.repository.ts   → Database queries & persistence layer
```

**Layer responsibilities:**

- **Entity** — defines the structure of the `netflix_shows` table and ensures consistent API responses.  
- **DTOs** — validate incoming data and prevent invalid payloads from reaching business logic or the database.  
- **Repository** — encapsulates all database operations, isolating database logic from services.  
- **Service** — contains the business logic and orchestrates repository actions.  
- **Controller** — exposes HTTP endpoints for client interactions.

This clean separation keeps the module predictable, maintainable, and easy to extend — even for a small CRUD assignment like this.

---

# 📁 Project Structure

```
prolem5_A_Crude_Server
├── src
│   ├── common
│   │   ├── filters
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors
│   │   │   └── pagination.interceptor.ts
│   │   ├── database
│   │   └── netflix-shows
│   │       ├── common
│   │       │   └── base
│   │       │       ├── base.repository.ts
│   │       │       └── base.service.ts
│   │       ├── interceptors
│   │       ├── interfaces
│   │       ├── dto
│   │       ├── entities
│   │       ├── netflix-shows.controller.spec.ts
│   │       ├── netflix-shows.controller.ts
│   │       ├── netflix-shows.module.ts
│   │       ├── netflix-shows.repository.ts
│   │       ├── netflix-shows.service.spec.ts
│   │       └── netflix-shows.service.ts
│   ├── scripts
│   │   └── run-migrations.ts
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test
├── .env
├── .env.example
├── .gitignore
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── eslint.config.mjs
├── nest-cli.json
├── nodemon.json
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
└── typeorm.config.ts
```

---

# 🚀 **How to Start the Project (IMPORTANT)**

This project runs **entirely via Docker**.  
You **do NOT** manually start the NestJS server — Docker handles that automatically.

### **1️⃣ Start Docker Services**
```bash
docker-compose up -d
```
This launches:
- the PostgreSQL database  
- the NestJS backend (auto-start inside container)

---

### **2️⃣ Run Database Migrations**
```bash
npm run db:migrate
```

---

### **3️⃣ Seed Initial Data**
```bash
npm run db:seed
```

---

### **Optional: Full Reset**
```bash
npm run db:reset
```

---

### 🎉 Done  
At this point:
- Docker is running  
- Backend server is live  
- Database tables created  
- Seed data inserted  
- API ready to use  

---

> **Note**  
> PostgreSQL is powerful, but for a single-table CRUD assignment like this, it is more complex than necessary.  
> SQLite would have been sufficient — simple, file-based, zero-configuration, and without requiring an external DB service.  
> PostgreSQL here is essentially overkill.

---

# 📄 API Documentation

API endpoints are fully documented here:

👉 **[View openapi.yaml](./openapi.yaml)**


### 👉 Download / Import into Postman

- **Postman Collection (v2)**  
  Use this to test all API endpoints:  
  [`postman/postman_collection_v2.json`](./postman/postman_collection_v2.json)

- **Environment File**  
  Includes variables such as `base_url` and sample `id`:  
  [`postman/netflix_api_environment.json`](./postman/netflix_api_environment.json)

### How to Use

1. Open Postman  
2. Import both files  
3. Select the `Netflix API Environment`  
4. Run requests instantly — all URLs use environment variables (e.g. `{{base_url}}/netflix-shows`)

You can now test the entire API with zero manual configuration.

---
