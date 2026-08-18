# 🎓 Student Placement Management System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://chakradharreddy1606137.github.io/Student_Placement_Management/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

> 🌐 **Live Website Link:** **[https://chakradharreddy1606137.github.io/Student_Placement_Management/](https://chakradharreddy1606137.github.io/Student_Placement_Management/)**  
> *Click the link above to test the interactive Student, Company, and Admin portals live in your browser.*

---

A full-stack web application that streamlines the campus placement process by connecting **Students**, **Companies**, and **Administrators** through a secure, role-based platform.

---

## 📋 Table of Contents

- [🌐 Live Demo](https://chakradharreddy1606137.github.io/Student_Placement_Management/)

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [User Roles](#user-roles)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Security Model](#security-model)
- [Prerequisites](#prerequisites)
- [Database Setup](#database-setup)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Testing Results](#testing-results)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

The **Student Placement Management System** is a role-based web application that manages the end-to-end placement process:

- Students can browse jobs, apply, and track their application status
- Companies can post jobs, review applicants, and update application statuses
- Administrators have full management access to all entities in the system

Authentication is handled via **JWT (JSON Web Tokens)**, with every API endpoint protected by Spring Security role-based access control.

---

## Features

### 👨‍🎓 Student
- Register and maintain a profile (CGPA, college, degree, skills, resume)
- Browse available job listings
- Apply to jobs (with eligibility checks: CGPA threshold, deadline)
- Track all submitted applications and their statuses
- View own profile securely via `/api/students/me`

### 🏢 Company
- Register and maintain a company profile
- Post new job listings with requirements (CGPA threshold, deadline, job type)
- View all applications received for company's jobs
- Update application statuses: `PENDING → ACCEPTED / SELECTED / REJECTED`
- Ownership enforced — cannot access other companies' data

### 🔑 Admin
- View and manage all students, companies, jobs, and applications
- Delete student/company/job records
- Update any application status
- Full access to all management endpoints

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router v7, Axios |
| **Build Tool** | Vite 8 |
| **Backend** | Spring Boot 3.3.3 |
| **Language** | Java 17 |
| **Security** | Spring Security + JWT (JJWT 0.12.6) |
| **ORM** | Spring Data JPA / Hibernate |
| **Database** | MySQL 8 |
| **API Style** | RESTful JSON API |

---

## System Architecture

```
┌─────────────────────────────────────────┐
│           Browser (React + Vite)        │
│         http://localhost:5174           │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────┐ │
│  │ Student  │  │ Company  │  │ Admin │ │
│  │  Pages   │  │  Pages   │  │ Pages │ │
│  └────┬─────┘  └────┬─────┘  └───┬───┘ │
│       └─────────────┴────────────┘      │
│              axiosInstance               │
│        (JWT injected via interceptor)   │
└──────────────────┬──────────────────────┘
                   │ HTTP REST
┌──────────────────▼──────────────────────┐
│       Spring Boot Backend               │
│       http://localhost:8083             │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │     JWT Authentication Filter   │    │
│  └────────────────┬────────────────┘    │
│  ┌────────────────▼────────────────┐    │
│  │     Spring Security (RBAC)      │    │
│  └────────────────┬────────────────┘    │
│  ┌────────────────▼────────────────┐    │
│  │  Controllers → Services →       │    │
│  │  Repositories (JPA)             │    │
│  └────────────────┬────────────────┘    │
└──────────────────┬──────────────────────┘
                   │ JDBC
┌──────────────────▼──────────────────────┐
│           MySQL Database                │
│       placement_management              │
└─────────────────────────────────────────┘
```

---

## User Roles

| Role | Description | Login Path |
|------|-------------|------------|
| `STUDENT` | Can apply for jobs, view own profile and applications | `/login/student` |
| `COMPANY` | Can post jobs, manage own applicants | `/login/company` |
| `ADMIN` | Full system access and management | `/login/admin` |

---

## Database Schema

```sql
users
  id, name, email, password (BCrypt), role (STUDENT/COMPANY/ADMIN)

students
  id, user_id (FK → users), college, degree, branch, graduation_year,
  cgpa, phone, resume_url

companies
  id, user_id (FK → users), company_name, description, website, location

jobs
  id, company_id (FK → companies), title, description, location, salary,
  job_type, minimum_cgpa, experience_required, deadline, created_at

applications
  id, student_id (FK → students), job_id (FK → jobs), status, applied_at

skills
  id, student_id (FK → students), name
```

### Entity Relationships

```
User 1──1 Student
User 1──1 Company
Company 1──* Job
Student 1──* Application
Job 1──* Application
Student 1──* Skill
```

---

## API Endpoints

### Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/auth/register` | Register new user |

### Students
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/students/me` | STUDENT | Get own profile |
| GET | `/api/students` | ADMIN | List all students |
| GET | `/api/students/{id}` | ADMIN | Get student by ID |
| POST | `/api/students` | ADMIN | Create student profile |
| DELETE | `/api/students/{id}` | ADMIN | Delete student |

### Companies
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/companies/me` | COMPANY | Get own company profile |
| GET | `/api/companies` | ADMIN | List all companies |
| GET | `/api/companies/{id}` | ADMIN | Get company by ID |
| DELETE | `/api/companies/{id}` | ADMIN | Delete company |

### Jobs
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/jobs` | STUDENT, COMPANY, ADMIN | List all jobs |
| GET | `/api/jobs/{id}` | STUDENT, COMPANY, ADMIN | Get job details |
| POST | `/api/jobs` | COMPANY, ADMIN | Create job posting |
| DELETE | `/api/jobs/{id}` | COMPANY (own), ADMIN | Delete job |

### Applications
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/applications/my` | STUDENT | View own applications |
| POST | `/api/applications` | STUDENT | Apply for a job |
| GET | `/api/applications` | COMPANY (own jobs), ADMIN | List applications |
| PATCH | `/api/applications/{id}/status` | COMPANY (own), ADMIN | Update status |
| DELETE | `/api/applications/{id}` | COMPANY (own), ADMIN | Delete application |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | ADMIN | List all users |

---

## Security Model

### JWT Authentication Flow

```
1. POST /api/auth/login  { email, password }
2. Server validates BCrypt password
3. JWT issued (HS384, 1-hour expiry)
4. Frontend stores token in localStorage
5. Every request sends: Authorization: Bearer <token>
6. JwtAuthenticationFilter validates token on each request
7. Spring Security checks role-based access
```

### Role-Based Access Control (RBAC)

Enforced at **two layers**:

1. **Spring Security** (`SecurityConfig.java`) — URL path + HTTP method role matching
2. **Service/Controller layer** — ownership verification (e.g., Company A cannot modify Company B's applications)

### Key Security Behaviors

| Scenario | Result |
|----------|--------|
| No JWT token | `403 Forbidden` |
| Tampered/invalid JWT | `403 Forbidden` |
| Student → admin endpoint | `403 Forbidden` |
| Company → student endpoint | `403 Forbidden` |
| Company A → Company B's data | `403 Forbidden` |
| Admin → any endpoint | `200 OK` |

---

## Prerequisites

| Tool | Version |
|------|---------|
| Java JDK | 17+ |
| Maven | 3.9+ |
| Node.js | 18+ |
| npm | 9+ |
| MySQL | 8.0+ |

---

## Database Setup

1. **Start MySQL server**

2. **Create the database:**

```sql
CREATE DATABASE placement_management;
```

3. **Create the tables:**

```sql
USE placement_management;

CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('STUDENT', 'COMPANY', 'ADMIN') NOT NULL
);

CREATE TABLE students (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNIQUE NOT NULL,
  college VARCHAR(255),
  degree VARCHAR(100),
  branch VARCHAR(100),
  graduation_year INT,
  cgpa DECIMAL(4,2),
  phone VARCHAR(20),
  resume_url VARCHAR(500),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE companies (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNIQUE NOT NULL,
  company_name VARCHAR(255),
  description TEXT,
  website VARCHAR(255),
  location VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE jobs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  company_id BIGINT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  location VARCHAR(255),
  salary DECIMAL(12,2),
  job_type ENUM('FULL_TIME','PART_TIME','INTERNSHIP'),
  minimum_cgpa DECIMAL(4,2),
  experience_required VARCHAR(100),
  deadline DATE,
  created_at DATETIME,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE applications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT NOT NULL,
  job_id BIGINT NOT NULL,
  status ENUM('PENDING','ACCEPTED','SELECTED','REJECTED') DEFAULT 'PENDING',
  applied_at DATETIME,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE skills (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT NOT NULL,
  name VARCHAR(100),
  FOREIGN KEY (student_id) REFERENCES students(id)
);
```

4. **Seed an admin user** (password: `password123`):

```sql
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@example.com',
  '$2a$10$cFPFplzNn3lRQW7LhUQb9.ATv/JQKH9eamqV6Jn9PN06wo4zIO2L6',
  'ADMIN');
```

---

## Backend Setup

1. **Navigate to the backend directory:**

```bash
cd backend
```

2. **Configure** `src/main/resources/application.properties`:

All secrets use environment variables with local defaults:

```properties
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/placement_management}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:root}
jwt.secret=${JWT_SECRET:StudentPlacementManagementJwtSecretKey2026SecureKey}
cors.allowed-origins=${CORS_ORIGINS:http://localhost:5173,http://localhost:5174}
```

For production, set environment variables instead of editing the file.

3. **Build and run:**

```bash
mvn clean install
mvn spring-boot:run
```

Backend starts at: **http://localhost:8083**

---

## Frontend Setup

1. **Navigate to the frontend directory:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **API base URL** is configured via environment variable in `src/utils/axiosInstance.js`:

```javascript
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8083'
```

For production builds, set `VITE_API_URL` before running `npm run build`.

4. **Start the development server:**

```bash
npm run dev
```

Frontend starts at: **http://localhost:5174**

---

## Running the Application

Start all three services in order:

```bash
# 1. Ensure MySQL is running with placement_management database

# 2. Start Backend (Terminal 1)
cd backend
mvn spring-boot:run

# 3. Start Frontend (Terminal 2)
cd frontend
npm run dev
```

Open your browser: **http://localhost:5174**

### Default Credentials (Development)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password123 |
| Student | student@example.com | password123 |
| Company | company@example.com | password123 |

> **Note:** Student and Company accounts are created via the Register flow. Only the Admin seed is provided above.

---

## Testing Results

### Security Testing — 49/49 PASS ✅

| Test Block | Tests | Result |
|------------|-------|--------|
| Unauthenticated access | 7 | ✅ All blocked (403) |
| Student → admin/company endpoints | 7 | ✅ All blocked (403) |
| Company → student/admin endpoints | 6 | ✅ All blocked (403) |
| Admin full access | 5 | ✅ All allowed (200) |
| Student profile isolation | 4 | ✅ Enforced |
| Company profile isolation | 3 | ✅ Enforced |
| Cross-company ownership | 8 | ✅ All blocked (403) |
| Invalid/tampered JWT | 3 | ✅ All rejected (403) |
| Student own application access | 2 | ✅ Correct |
| Job management ownership | 2 | ✅ All blocked (403) |
| Post-logout protection | 2 | ✅ All blocked (403) |

### Workflow Testing

| Workflow | Result |
|----------|--------|
| 15.2 Authentication (5 cases) | ✅ PASS |
| 15.3 Student Workflow (9 tests) | ✅ PASS |
| 15.4 Company Workflow | ✅ PASS |
| 15.5 Admin Workflow | ✅ PASS |
| 15.6 Security Testing (49 tests) | ✅ PASS |

---

## Project Structure

```
Student_Placement/
├── README.md
├── .gitignore
│
├── frontend/                            # React + Vite Frontend
│   ├── src/
│   │   ├── utils/
│   │   │   └── axiosInstance.js         # Axios with JWT interceptor
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # Landing page
│   │   │   ├── Login.jsx                # Role-based login
│   │   │   ├── ProtectedRoute.jsx       # Route guard component
│   │   │   ├── StudentDashboard.jsx     # Student home
│   │   │   ├── StudentProfile.jsx       # Student profile view
│   │   │   ├── Jobs.jsx                 # Job listings
│   │   │   ├── JobDetails.jsx           # Single job view
│   │   │   ├── ApplyJob.jsx             # Job application form
│   │   │   ├── MyApplications.jsx       # Student's applications
│   │   │   ├── CompanyDashboard.jsx     # Company home
│   │   │   ├── CompanyProfile.jsx       # Company profile view
│   │   │   ├── PostJob.jsx              # Create job posting
│   │   │   ├── MyJobs.jsx               # Company's job listings
│   │   │   ├── JobApplications.jsx      # Applications for a job
│   │   │   ├── AdminDashboard.jsx       # Admin home
│   │   │   ├── ManageStudents.jsx       # Admin: student CRUD
│   │   │   ├── ManageCompanies.jsx      # Admin: company CRUD
│   │   │   ├── ManageJobs.jsx           # Admin: job management
│   │   │   └── ManageApplications.jsx   # Admin: application management
│   │   ├── App.jsx                      # Route definitions
│   │   └── main.jsx                     # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                             # Spring Boot Backend
│   ├── pom.xml
│   └── src/main/java/com/example/placement/
│       ├── PlacementManagementApplication.java
│       ├── config/
│       │   ├── SecurityConfig.java          # RBAC + CORS
│       │   └── JwtAuthenticationFilter.java # JWT filter
│       ├── controller/
│       │   ├── AuthController.java          # Login/Register
│       │   ├── StudentController.java
│       │   ├── CompanyController.java
│       │   ├── JobController.java
│       │   ├── ApplicationController.java
│       │   └── UserController.java
│       ├── dto/                             # Data Transfer Objects
│       ├── service/
│       │   ├── StudentService.java
│       │   ├── CompanyService.java
│       │   ├── JobService.java
│       │   ├── ApplicationService.java
│       │   ├── JwtService.java              # Token generation/validation
│       │   └── CustomUserDetailsService.java
│       ├── model/
│       │   ├── User.java
│       │   ├── Student.java
│       │   ├── Company.java
│       │   ├── Job.java
│       │   ├── Application.java
│       │   └── Skill.java
│       └── repository/
│           ├── UserRepository.java
│           ├── StudentRepository.java
│           ├── CompanyRepository.java
│           ├── JobRepository.java
│           └── ApplicationRepository.java
│
└── database/
    └── schema.sql                           # Database schema
```

---

## Deployment

### Backend (Spring Boot)

1. **Build the JAR:**

```bash
cd backend
mvn clean package -DskipTests
```

2. **Run on server with environment variables:**

```bash
DB_URL=jdbc:mysql://PROD_HOST:3306/placement_management \
DB_USERNAME=prod_user \
DB_PASSWORD=prod_pass \
JWT_SECRET=YOUR_STRONG_256_BIT_SECRET \
CORS_ORIGINS=https://your-frontend.vercel.app \
SHOW_SQL=false \
java -jar target/placement-management-0.0.1-SNAPSHOT.jar
```

Deploy to: **Railway**, **Render**, **AWS Elastic Beanstalk**, or **Heroku**

### Frontend (React/Vite)

1. Set the production API URL via environment variable
2. Build the production bundle:

```bash
cd frontend
VITE_API_URL=https://your-backend.railway.app npm run build
```

3. Deploy the `dist/` folder to:
   - **GitHub Pages (Active)**: Automated via `.github/workflows/deploy.yml` → [Live Demo](https://chakradharreddy1606137.github.io/Student_Placement_Management/)
   - **Vercel** (recommended for Vite): `vercel --prod`
   - **Netlify**: drag-and-drop `dist/` folder
   - **AWS S3** + CloudFront

### Database (MySQL)

- Use **PlanetScale**, **Railway MySQL**, **AWS RDS**, or any managed MySQL service
- Run the schema SQL from the [Database Setup](#database-setup) section
- Update `application.properties` to point to the production database host

### Pre-Deployment Checklist

- [ ] Set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` environment variables
- [ ] Set `JWT_SECRET` to a strong random 256-bit key
- [ ] Set `CORS_ORIGINS` to your production frontend URL
- [ ] Set `SHOW_SQL=false` for production
- [ ] Set `VITE_API_URL` to your production backend URL before building frontend
- [ ] Enable HTTPS on both frontend and backend
- [ ] Verify `spring.jpa.hibernate.ddl-auto=validate` (never `create` in production)

---

## License

This project was developed as part of an academic placement management system.
