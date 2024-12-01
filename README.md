# Backend for Assignment 2

## Features
- User Signup and Login
- Employee CRUD Operations
- Employee Search by Department or Position

## API Endpoints
### User
- `POST /signup` - Register a new user.
- `POST /login` - Login and receive a token.

### Employee
- `POST /employees` - Create a new employee.
- `GET /employees` - List all employees.
- `GET /employees/:id` - Get details of a specific employee.
- `PUT /employees/:id` - Update an employee.
- `DELETE /employees/:id` - Delete an employee.
- `GET /employees/search` - Search employees by department or position.
