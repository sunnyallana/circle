# Circle - Contact Management System

A full-stack web application for efficiently managing your personal and professional contacts with user authentication, CRUD operations, and a responsive user interface.

## Overview

Circle is a modern contact management system that allows users to register, log in, and manage their contacts through an intuitive web interface. Built with enterprise-grade technologies, Circle provides a robust solution for organizing and maintaining your network with features like search, pagination, and detailed contact profiles.

## Technology Stack

### Backend
- **Java** - Core programming language
- **Spring Boot** - Application framework
- **Spring Data JPA** - Data persistence layer
- **Hibernate** - ORM framework
- **JUnit & Mockito** - Unit testing frameworks
- **Slf4j & Logback** - Logging framework
- **SQL Server** - Database

### Frontend
- **React.js** - UI framework
- **JavaScript** - Client-side scripting

### DevOps & Quality
- **SonarQube** - Code quality analysis
- **Git** - Version control

## Features

### User Authentication & Authorization
- User registration with email or phone number
- Secure login with credentials
- Password change functionality
- Session management

### Contact Management
- Create, read, update, and delete (CRUD) contacts
- Paginated contact listing
- Search and filter contacts by name
- Detailed contact profiles with multiple fields:
  - First Name
  - Last Name
  - Title
  - Multiple Email Addresses (work, personal, etc.)
  - Multiple Phone Numbers (work, home, personal, etc.)

### Technical Features
- Comprehensive application logging using Slf4J and Logback
- Global exception handling with meaningful error messages
- Unit test coverage for controllers, services, and data access layers
- Code quality monitoring with SonarQube
- Responsive and interactive React.js frontend

### Optional Features
- Export contacts to file
- Import contacts from file

## Application Screens

### 1. Login and Registration
- User registration form
- Login form
- Automatic redirect to contact management upon successful authentication

### 2. Contact Management Screen
- Paginated contact list display
- Search/filter functionality
- Create Contact Modal
- Update Contact Modal (with prepopulated data)
- Delete Confirmation Modal

### 3. User Profile Screen
- Display user information
- Change password modal
- Logout functionality

## Prerequisites

Before running Circle, ensure you have the following installed:

- Java JDK 11 or higher
- Node.js and npm
- SQL Server
- Maven
- Git
- SonarQube (for code quality analysis)

## Installation

### Backend Setup

```bash
# Clone the repository
git clone <repository-url>
cd circle

# Navigate to backend directory
cd backend

# Install dependencies
mvn clean install

# Configure database connection in application.properties
# Update the following properties:
# spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=circle_db
# spring.datasource.username=your_username
# spring.datasource.password=your_password

# Run the application
mvn spring-boot:run
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The application will be available at `http://localhost:3000`

## Database Schema

Circle uses a SQL Server database with the following main entities:

- **Users** - Stores user account information
- **Contacts** - Stores contact details linked to users
- **Email Addresses** - Multiple emails per contact
- **Phone Numbers** - Multiple phone numbers per contact

## Running Tests

```bash
# Run backend unit tests
cd backend
mvn test

# Run frontend tests
cd frontend
npm test
```

## Code Quality

```bash
# Run SonarQube analysis
mvn sonar:sonar
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout

### Contacts
- `GET /api/contacts` - Get all contacts (paginated)
- `GET /api/contacts/{id}` - Get contact by ID
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/{id}` - Update contact
- `DELETE /api/contacts/{id}` - Delete contact
- `GET /api/contacts/search?query={query}` - Search contacts

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Project Structure

```
circle/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/circle/
│   │   │   │       ├── controller/
│   │   │   │       ├── service/
│   │   │   │       ├── repository/
│   │   │   │       ├── model/
│   │   │   │       ├── dto/
│   │   │   │       ├── exception/
│   │   │   │       └── config/
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── logback.xml
│   │   └── test/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## Git Workflow

- Use feature branches for new development
- Follow conventional commit messages
- Create pull requests for code review
- Merge to main branch after approval

## Logging

Circle uses Slf4j with Logback for comprehensive logging:
- Application events
- Error tracking
- User activities
- Performance metrics

Log files are stored in the `logs/` directory.

## Exception Handling

Global exception handling is implemented to:
- Catch and handle all application errors
- Provide meaningful error messages to users
- Log exceptions with full stack traces
- Return appropriate HTTP status codes

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please create an issue in the repository or contact the development team.

## Acknowledgments

Circle is built as part of the Java Full Stack (Java + ReactJS) training program, designed to demonstrate modern web application development practices and enterprise-level software architecture.
