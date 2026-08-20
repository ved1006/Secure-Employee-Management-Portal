# Employee Management System

A full-stack **Employee Management System** built with **React, Spring Boot, Spring Security, JWT, JPA/Hibernate, and MySQL**. The application provides secure role-based access control, employee and department management, user administration, announcements, and a complete employee leave-management workflow.

The project is also **Dockerized and deployed to the cloud**, using Nginx as a reverse proxy, Render for application hosting, and Aiven MySQL for the production database.

---

## 🚀 Features

### 🔐 Authentication & Security

- User registration
- User login
- JWT-based authentication
- Stateless authentication using Spring Security
- BCrypt password hashing
- Custom JWT authentication filter
- Spring Security `SecurityContext`
- Protected REST APIs
- Role-based authorization 
- Enabled/disabled user accounts
- Logout functionality
- Automatic JWT attachment to API requests
- Secure password storage
- Environment-based JWT configuration

---

## 🛡️ Role-Based Access Control

The application supports three roles:

- `ADMIN`
- `HR`
- `EMPLOYEE`

Authorization is enforced on the **backend using Spring Security**, while the frontend uses role-aware routing and navigation for a better user experience.

| Functionality | ADMIN | HR | EMPLOYEE |
|---|:---:|:---:|:---:|
| View Employees | ✅ | ✅ | ❌ |
| Add Employee | ✅ | ✅ | ❌ |
| Update Employee | ✅ | ✅ | ❌ |
| Delete Employee | ✅ | ❌ | ❌ |
| View Employee by ID | ✅ | ✅ | ❌ |
| Manage Departments | ✅ | ✅ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| Update User Role | ✅ | ❌ | ❌ |
| Enable/Disable Users | ✅ | ❌ | ❌ |
| View Own Employee Profile | ❌ | ❌ | ✅ |
| Submit Leave Request | ❌ | ❌ | ✅ |
| View Own Leave Requests | ❌ | ❌ | ✅ |
| View Leave Requests | ✅ | ✅ | ❌ |
| Approve Leave | ✅ | ✅ | ❌ |
| Reject Leave | ✅ | ✅ | ❌ |
| View Announcements | ✅ | ✅ | ✅ |

---

# 👥 Employee Management

The employee module provides complete employee management functionality for authorized ADMIN and HR users.

### Functionality

- Create employees
- View all employees
- View individual employees
- Update employee information
- Delete employees
- Assign departments
- Assign application roles
- Create employee login accounts
- Secure employee passwords using BCrypt
- Retrieve an employee's own profile
- Return employee data through DTOs

# Demo Link: https://secure-employee-management.onrender.com
