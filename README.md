# Student Management System

A simple, clean, full-stack Student Management System built as a college-level CRUD project. Manage student records with a React frontend, Express REST API, and SQLite database.

## Features

- Add, view, edit, and delete student records
- Search students by name, email, or department
- Dashboard with summary statistics (total students, departments, current year students)
- Frontend and backend validation
- Persistent SQLite storage (data survives browser refresh and server restart)
- Loading states and user-friendly error messages
- Responsive, modern UI

## Technology Stack

| Layer    | Technology              |
| -------- | ----------------------- |
| Frontend | React, Vite, JavaScript |
| Styling  | Plain CSS               |
| Backend  | Node.js, Express.js     |
| Database | SQLite (sql.js)       |
| API      | REST, JSON              |

## Project Structure

```
student-management-system/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── database/
│   │   ├── database.js
│   │   └── students.db          (auto-created)
│   ├── routes/
│   │   └── studentRoutes.js
│   └── controllers/
│       └── studentController.js
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── main.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── StudentCard.jsx
│       │   ├── StudentForm.jsx
│       │   └── StudentList.jsx
│       └── services/
│           └── studentApi.js
├── .gitignore
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

## Installation

### 1. Clone or download the project

```bash
cd student-management-system
```

### 2. Backend setup

```bash
cd backend
npm install
```

Copy the environment file (optional — defaults work for local development):

```bash
cp .env.example .env
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Copy the environment file:

```bash
cp .env.example .env
```

## How to Run

Open **two terminal windows**.

### Terminal 1 — Start the backend

```bash
cd backend
npm start
```

The server runs at **http://localhost:5000**

### Terminal 2 — Start the frontend

```bash
cd frontend
npm run dev
```

The app opens at **http://localhost:5173**

## Database

- SQLite database file: `backend/database/students.db`
- Created automatically on first server start
- `students` table is created automatically with the required schema

### Table Schema

| Column     | Type     | Constraints                        |
| ---------- | -------- | ---------------------------------- |
| id         | INTEGER  | PRIMARY KEY AUTOINCREMENT          |
| name       | TEXT     | NOT NULL                           |
| email      | TEXT     | NOT NULL, UNIQUE                   |
| phone      | TEXT     |                                    |
| department | TEXT     | NOT NULL                           |
| year       | INTEGER  | NOT NULL                           |
| section    | TEXT     |                                    |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP          |

## API Endpoints

| Method | Endpoint                    | Description              | Status Codes          |
| ------ | --------------------------- | ------------------------ | --------------------- |
| GET    | `/api/students`             | Get all students         | 200                   |
| GET    | `/api/students/:id`         | Get one student          | 200, 404              |
| POST   | `/api/students`             | Create a student         | 201, 400, 409         |
| PUT    | `/api/students/:id`         | Update a student         | 200, 400, 404, 409    |
| DELETE | `/api/students/:id`         | Delete a student         | 200, 404              |
| GET    | `/api/students/search?q=`   | Search students          | 200, 400              |

### Example Request — Create Student

```json
POST /api/students
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "department": "Computer Science",
  "year": 2,
  "section": "A"
}
```

## CRUD Functionality

1. **Create** — Fill the form and click "Add Student"
2. **Read** — Students appear in the table; refresh the page and data persists
3. **Update** — Click "Edit", modify fields, click "Update Student"
4. **Delete** — Click "Delete", confirm the dialog
5. **Search** — Type in the search box to filter by name, email, or department

## Validation

### Required Fields
- Name, Email, Department, Year

### Rules
- Name cannot be empty
- Email must be a valid format and unique
- Phone must contain 7–15 digits (if provided)
- Year must be 1–6

Validation is enforced on both frontend and backend.

## Testing Instructions

### Manual Testing

1. Start backend and frontend (see above)
2. Open http://localhost:5173 in your browser
3. Add a student — verify it appears in the table
4. Refresh the page — student should still be there
5. Edit the student — verify changes persist
6. Search for the student by name
7. Delete the student — confirm it is removed
8. Try submitting empty required fields — should show errors
9. Try an invalid email — should be rejected
10. Try a duplicate email — should show "This email is already registered"

### API Testing (with curl or Postman)

```bash
# Health check
curl http://localhost:5000/api/health

# Get all students
curl http://localhost:5000/api/students

# Create a student
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","phone":"1234567890","department":"Physics","year":3,"section":"B"}'

# Get one student
curl http://localhost:5000/api/students/1

# Update a student
curl -X PUT http://localhost:5000/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Smith","email":"jane@example.com","phone":"1234567890","department":"Physics","year":3,"section":"B"}'

# Search students
curl "http://localhost:5000/api/students/search?q=Jane"

# Delete a student
curl -X DELETE http://localhost:5000/api/students/1
```

### Verify Database

After adding students, check that `backend/database/students.db` exists and contains data. You can inspect it with any SQLite browser or:

```bash
cd backend
node -e "const {initDatabase,getDb}=require('./database/database'); initDatabase().then(()=>console.log(getDb().queryAll('SELECT * FROM students')));"
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description     |
| -------- | ------- | --------------- |
| PORT     | 5000    | Server port     |

### Frontend (`frontend/.env`)

| Variable           | Default                      | Description  |
| ------------------ | ---------------------------- | ------------ |
| VITE_API_BASE_URL  | http://localhost:5000/api    | API base URL |

## License

This project is for educational purposes.
