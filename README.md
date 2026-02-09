# Contact Management System

A full-stack contact management system built with Java Spring Boot backend and React frontend. This application allows users to register, login, and manage their contacts with full CRUD operations, search functionality, and pagination.

## Video Demonstrations

Watch these video tutorials to see the application in action and learn how to use it:

### 1. Complete Demonstration
[![Complete Demonstration](https://img.youtube.com/vi/pwQKqkZmDig/maxresdefault.jpg)](https://youtu.be/pwQKqkZmDig)

**[Complete Demonstration](https://youtu.be/pwQKqkZmDig)**

### 2. Unit Testing using Junit and Mockito
[![Unit Testing using Junit and Mockito](https://img.youtube.com/vi/hXB8ot8L130/maxresdefault.jpg)](https://youtu.be/hXB8ot8L130)

**[Watch: Unit Testing using Junit and Mockito](https://youtu.be/hXB8ot8L130)**

### 3. API Testing with Curl and Bash Script
[![API Tests using Curl in a Bash Script](https://img.youtube.com/vi/hzb1ZJkuT4k/maxresdefault.jpg)](https://youtu.be/hzb1ZJkuT4k)

**[Watch: API Tests using Curl in a Bash Script](https://youtu.be/hzb1ZJkuT4k)**

---

## Features

### User Management
- User registration with email or phone number
- Secure login with JWT authentication
- Password change functionality
- User profile management

### Contact Management
- Create, read, update, and delete contacts
- Multiple email addresses per contact (work, personal, etc.)
- Multiple phone numbers per contact (work, home, personal, etc.)
- Contact search and filtering
- Paginated contact listing
- Detailed contact profiles

### Technical Features
- RESTful API architecture
- JWT-based authentication
- BCrypt password encryption
- Global exception handling
- Request validation
- Comprehensive logging with Slf4j
- CORS configuration for frontend integration

## Technology Stack

### Backend
- **Java 25**
- **Spring Boot 4.0.1**
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - Data persistence
- **Hibernate** - ORM
- **PostgreSQL** - Database
- **JWT (jsonwebtoken)** - Token-based authentication
- **Lombok** - Reduce boilerplate code
- **Maven** - Build tool
- **Slf4j & Logback** - Logging

### Testing
- **JUnit** - Unit testing framework
- **Mockito** - Mocking framework
- **Spring Boot Test** - Integration testing

## Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK) 25**
- **Maven 3.8+**
- **PostgreSQL 12+**
- **Git** (optional, for version control)
- **curl** and **jq** (for API testing)

### Installation on CachyOS/Arch Linux

```bash
# Update system
sudo pacman -Syu

# Install Java 25
sudo pacman -S jdk-openjdk

# Install Maven
sudo pacman -S maven

# Install PostgreSQL
sudo pacman -S postgresql

# Install testing tools
sudo pacman -S curl jq

# Verify installations
java -version
mvn -version
psql --version
```

## Database Setup

### Step 1: Initialize PostgreSQL

```bash
# Initialize PostgreSQL database cluster
sudo -u postgres initdb -D /var/lib/postgres/data

# Start PostgreSQL service
sudo systemctl start postgresql

# Enable PostgreSQL to start on boot
sudo systemctl enable postgresql

# Check PostgreSQL status
sudo systemctl status postgresql
```

### Step 2: Create Database and User

```bash
# Connect to PostgreSQL as postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE contact_management;

# Create user (optional, or use default postgres user)
CREATE USER contact_user WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE contact_management TO contact_user;

# Exit PostgreSQL prompt
\q
```

### Step 3: Configure Database Authentication (if needed)

If you encounter authentication issues:

```bash
# Edit pg_hba.conf
sudo nano /var/lib/postgres/data/pg_hba.conf

# Change authentication method from 'peer' to 'md5' for local connections:
# local   all             all                                     md5
# host    all             all             127.0.0.1/32            md5
# host    all             all             ::1/128                 md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

## Project Setup

### Step 1: Clone or Download Project

```bash
# If using Git
git clone https://github.com/sunnyallana/circle.git
cd circle

# Or create project directory
mkdir -p circle
cd circle
```

### Step 2: Configure Application

Edit `src/main/resources/application.yml` with your database credentials:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/contact_management
    username: postgres
    password: postgres  # Change to your password
    driver-class-name: org.postgresql.Driver
```

### Step 3: Build the Project

```bash
# Clean and install dependencies
mvn clean install

# Skip tests if needed
mvn clean install -DskipTests
```

### Step 4: Run the Application

```bash
# Run with Maven
mvn spring-boot:run

# Or run the JAR file
java -jar target/circle-0.0.1-SNAPSHOT.jar
```

The application will start on `http://localhost:8080`

You should see output similar to:
```
Started CircleApplication in X.XXX seconds
```

## Project Structure

```
circle/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── susa/
│   │   │           └── circle/
│   │   │               ├── CircleApplication.java
│   │   │               ├── config/
│   │   │               │   └── SecurityConfig.java
│   │   │               ├── controller/
│   │   │               │   ├── AuthController.java
│   │   │               │   └── ContactController.java
│   │   │               ├── dto/
│   │   │               │   ├── request/
│   │   │               │   └── response/
│   │   │               ├── entity/
│   │   │               │   ├── Contact.java
│   │   │               │   ├── ContactEmail.java
│   │   │               │   ├── ContactPhone.java
│   │   │               │   └── User.java
│   │   │               ├── enums/
│   │   │               ├── exception/
│   │   │               ├── mapper/
│   │   │               ├── repository/
│   │   │               ├── security/
│   │   │               └── service/
│   │   └── resources/
│   │       └── application.yml
│   └── test/
├── pom.xml
├── test-apis.sh
└── README.md
```

## API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "active": true
    }
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

### Contact Endpoints

#### Create Contact
```http
POST /api/contacts
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "title": "Software Engineer",
  "emails": [
    {
      "email": "jane@work.com",
      "type": "WORK"
    },
    {
      "email": "jane@personal.com",
      "type": "PERSONAL"
    }
  ],
  "phones": [
    {
      "phoneNumber": "+1987654321",
      "type": "WORK"
    }
  ]
}
```

#### Get All Contacts (Paginated)
```http
GET /api/contacts?page=0&size=10&sortBy=firstName&sortDir=ASC
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` - Page number (default: 0)
- `size` - Number of items per page (default: 10)
- `sortBy` - Field to sort by (default: firstName)
- `sortDir` - Sort direction: ASC or DESC (default: ASC)

#### Search Contacts
```http
GET /api/contacts/search?query=jane&page=0&size=10
Authorization: Bearer <token>
```

#### Get Contact by ID
```http
GET /api/contacts/{id}
Authorization: Bearer <token>
```

#### Update Contact
```http
PUT /api/contacts/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith Updated",
  "title": "Senior Software Engineer",
  "emails": [...],
  "phones": [...]
}
```

#### Delete Contact
```http
DELETE /api/contacts/{id}
Authorization: Bearer <token>
```

## Testing the API

### Using the Test Script

A bash script is provided to test all API endpoints:

```bash
# Make the script executable
chmod +x test-apis.sh

# Run the test script
./test-apis.sh
```

The script provides an interactive menu with options to:
1. Register a new user
2. Login
3. Get current user profile
4. Create contacts
5. List all contacts
6. Search contacts
7. Update contacts
8. Delete contacts
9. Change password
10. Test error handling
11. Run all tests sequentially

### Using curl Manually

#### Register and Login
```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }' | jq .

# Login and save token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john@example.com",
    "password": "password123"
  }' | jq -r '.data.token')

echo "Token: $TOKEN"
```

#### Create and Manage Contacts
```bash
# Create contact
curl -X POST http://localhost:8080/api/contacts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "title": "Engineer",
    "emails": [{"email": "jane@example.com", "type": "WORK"}],
    "phones": [{"phoneNumber": "+1234567890", "type": "PERSONAL"}]
  }' | jq .

# Get all contacts
curl -X GET "http://localhost:8080/api/contacts?page=0&size=10" \
  -H "Authorization: Bearer $TOKEN" | jq .

# Search contacts
curl -X GET "http://localhost:8080/api/contacts/search?query=jane" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

## Configuration

### Application Properties

The application can be configured via `src/main/resources/application.yml`:

```yaml
spring:
  application:
    name: circle
  
  datasource:
    url: jdbc:postgresql://localhost:5432/contact_management
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
    
  jpa:
    hibernate:
      ddl-auto: update  # Options: create, create-drop, update, validate, none
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
    
server:
  port: 8080
  
jwt:
  secret: your-secret-key-here
  expiration: 86400000  # 24 hours in milliseconds

logging:
  level:
    com.susa.circle: DEBUG
  file:
    name: logs/application.log
```

### Database DDL Options

- `create` - Drop and create tables on startup
- `create-drop` - Drop tables on shutdown
- `update` - Update schema (recommended for development)
- `validate` - Validate schema, don't make changes
- `none` - Do nothing

## Database Management

### View Database Contents

```bash
# Connect to database
sudo -u postgres psql -d contact_management

# List all tables
\dt

# View users
SELECT * FROM users;

# View contacts
SELECT * FROM contacts;

# Exit
\q
```

### Reset Database

```bash
# Drop and recreate database
sudo -u postgres psql -c "DROP DATABASE IF EXISTS contact_management;"
sudo -u postgres psql -c "CREATE DATABASE contact_management;"

# Restart application to recreate schema
mvn spring-boot:run
```

### Clear All Data (Keep Schema)

```bash
# Connect to database
sudo -u postgres psql -d contact_management

# Truncate tables (in order due to foreign keys)
TRUNCATE TABLE contact_emails CASCADE;
TRUNCATE TABLE contact_phones CASCADE;
TRUNCATE TABLE contacts CASCADE;
TRUNCATE TABLE users CASCADE;

\q
```

## Security

### JWT Token
- Tokens expire after 24 hours (configurable)
- Token is required for all protected endpoints
- Include token in Authorization header: `Bearer <token>`

### Password Security
- Passwords are hashed using BCrypt
- Minimum password length: 6 characters
- Passwords are never stored in plain text

### CORS
- Configured for `http://localhost:3000` and `http://localhost:5173`
- Modify `SecurityConfig.java` to add additional origins

## Troubleshooting

### Application won't start

**Check Java version:**
```bash
java -version
# Should be Java 25
```

**Check if port 8080 is in use:**
```bash
sudo lsof -i :8080
# Kill process if needed
kill -9 <PID>
```

### Database connection errors

**Check PostgreSQL is running:**
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

**Verify database exists:**
```bash
sudo -u postgres psql -l | grep contact_management
```

**Test connection:**
```bash
sudo -u postgres psql -d contact_management -c "SELECT 1;"
```

### Authentication errors

**Clear database and restart:**
```bash
sudo -u postgres psql -c "DROP DATABASE IF EXISTS contact_management;"
sudo -u postgres psql -c "CREATE DATABASE contact_management;"
mvn spring-boot:run
```

### Build errors

**Clean and rebuild:**
```bash
mvn clean install -U
```

**Check Maven version:**
```bash
mvn -version
# Should be Maven 3.8+
```

## Development

### Running Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=UserServiceTest

# Run with coverage
mvn clean test jacoco:report
```

### Building for Production

```bash
# Build JAR file
mvn clean package

# Run JAR
java -jar target/circle-0.0.1-SNAPSHOT.jar
```

### Logging

Logs are written to:
- Console (during development)
- `logs/application.log` (file)

Log levels can be configured in `application.yml`:
```yaml
logging:
  level:
    com.susa.circle: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG
```

## Future Enhancements

- Export contacts to CSV/JSON
- Import contacts from file
- Contact groups/tags
- Profile pictures
- Email/SMS integration
- Advanced search filters
- Contact notes and history
- Shared contacts between users
- SonarQube integration for code quality
- Docker containerization
- CI/CD pipeline

## License

This project is part of the 10Pearls Internship Program.

## Support

For issues or questions, please contact the development team or create an issue in the project repository.

## Authors

- Sunny Shaban Ali (SU-S-A) - 10Pearls Java Full-Stack Intern

## Acknowledgments

- 10Pearls for the internship opportunity
- Spring Boot team for excellent documentation
- PostgreSQL community
