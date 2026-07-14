# Secure Employee Management Portal

A full-stack, secure web application for managing employees and departments within an organization. Built using **Spring Boot 3** for a robust and secure REST API backend, and **React 19** with **Vite** and **Tailwind CSS v4** for a modern, responsive, and interactive user interface.

---

## 🚀 Features

- **JWT-Based Authentication**: Secure registration and login flow issuing JSON Web Tokens.
- **Role-Based Access Control (RBAC)**: Restricts API endpoints and views based on roles (e.g., ADMIN, EMPLOYEE).
- **Employee Management**: CRUD operations to add, view, update, and remove employee records.
- **Department Management**: Organize employees into departments with full CRUD capability.
- **Modern Responsive UI**: Clean, dynamic UI featuring state preservation and route protection.

---

## 🛠️ Tech Stack

### Backend
- **Core Framework**: Spring Boot 3.5.x & Java 17
- **Security**: Spring Security 6 & JSON Web Token (JWT)
- **Data Access**: Spring Data JPA & Hibernate
- **Database**: MySQL
- **Developer Tools**: Lombok & Spring Boot DevTools

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4
- **API Client**: Axios (with interceptors for adding Auth headers & handling 401s)
- **Routing**: React Router DOM

---

## 📁 Folder Structure

```text
management/
├── .mvn/                       # Maven wrapper configuration
├── frontend/                   # Frontend React Application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # Auth and State contexts
│   │   ├── pages/              # Page components (Login, Dashboard, etc.)
│   │   ├── services/           # Axios API services
│   │   ├── App.jsx             # Main router and app layout
│   │   ├── index.css           # Styling entry point
│   │   └── main.jsx            # React root mount
│   ├── package.json
│   └── vite.config.js
├── src/                        # Backend Spring Boot Application
│   ├── main/
│   │   ├── java/com/employee/management/
│   │   │   ├── Controller/     # REST Endpoints
│   │   │   ├── Model/          # Entities (Employee, Department, User)
│   │   │   ├── Repository/     # JPA Repositories
│   │   │   ├── Service/        # Business Logic
│   │   │   ├── config/         # Security configuration
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   └── security/       # JWT Service & Filter
│   │   └── resources/
│   │       ├── application.properties        # Main properties file (with placeholders)
│   │       └── application-local.properties  # Local secrets (ignored by Git)
├── pom.xml                     # Maven project specification
└── README.md                   # Project documentation
```

---


## ⚙️ Setup & Installation

### Prerequisites
- **Java**: JDK 17 or higher
- **Node.js**: v18 or higher & npm
- **Database**: MySQL Server running locally

### Database Setup
1. Log in to your MySQL terminal or client.
2. Create a new database named `employeedb`:
   ```sql
   CREATE DATABASE employeedb;
   ```

### Backend Configuration
1. Open the project root.
2. Navigate to `src/main/resources/`.
3. Create a file named `application-local.properties` (this is ignored by git) and add your database and JWT credentials:
   ```properties
   spring.datasource.password=your_mysql_password
   jwt.secret=your_super_secret_jwt_key_containing_at_least_256_bits
   ```
4. Adjust the MySQL username in the main `application.properties` file if your local username is not `root`.

### Run Backend
Navigate to the root directory and execute:
```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux / macOS
chmod +x mvnw
./mvnw spring-boot:run
```
The server will start on port `8080`.

### Run Frontend
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
The frontend will start and can be accessed at `http://localhost:5173`. All backend API calls via `/api` are automatically proxied to `http://localhost:8080`.

---

## 📸 Screenshots

*(Placeholders - Add screenshots of the Login, Employee Dashboard, and Department management panels here)*

---

## 🔮 Future Improvements

- **Pagination & Sorting**: Implement database pagination and filtering on the employee listings.
- **Audit Logging**: Maintain history of changes (creation, updates, deletion) to employees and departments.
- **Enhanced Verification**: Add unit and integration tests using Mockito and Spring Boot Test.
- **CI/CD Pipeline**: Setup GitHub Actions for automated build and test runs.
- **Docker Support**: Add a `Dockerfile` and `docker-compose.yml` for seamless multi-container deployment.
