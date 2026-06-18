# Book a Doctor App

A complete MERN stack healthcare booking application for patients, doctors, and administrators.

## Features

- Patient registration, login, profile management
- Doctor registration, profile creation, availability and appointment management
- Admin dashboard with doctor verification and analytics
- Appointment booking, cancellation, and status tracking
- Secure JWT authentication and role-based access control
- Medical report upload with secure file validation
- Responsive UI using React, Bootstrap, and React Router

## Project Structure

```
Book-A-Doctor/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── index.js
│   ├── package.json
│   └── .env.example
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── uploads/
│   ├── package.json
│   └── .env.example
└── README.md
```

## Setup Guide

### 1. Backend

1. Open a terminal in `server/`
2. Install dependencies:
   ```bash
   cd server
   npm install
   ```
3. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```

### 2. Frontend

1. Open a terminal in `client/`
2. Install dependencies:
   ```bash
   cd client
   npm install
   ```
3. Copy `.env.example` to `.env` and review API address.
4. Start the frontend:
   ```bash
   npm run dev
   ```

### Frontend Pages

- Home, About, Contact
- Doctor Listing, Doctor Details
- Login, Register
- Patient Dashboard, Appointment History, Upload Reports, Profile
- Doctor Dashboard, Doctor Appointments
- Admin Dashboard, Manage Doctors, Manage Users, Manage Appointments

### 3. MongoDB Atlas

This project uses MongoDB Atlas as the primary cloud database. Use MongoDB Compass for database management, schema browsing, and query inspection.

1. Visit https://www.mongodb.com/cloud/atlas and sign in or create an account. 
2. Create a new project and click "Build a Database".
3. Choose the free Shared Cluster tier and create the cluster.
4. Add your IP address to Network Access under "Security".
5. Create a database user under "Database Access" with a username and password.
6. In the cluster view, click "Connect" → "Connect your application".
7. Copy the connection string and paste it into `server/.env` as `MONGO_URI`.

Example `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/book-a-doctor?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:3000
```

Example `server/.env` if using local MongoDB:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/book-a-doctor
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:3000
```

### Database Management

- Primary database: MongoDB Atlas cloud cluster.
- Recommended management tool: MongoDB Compass.
- In Compass, connect to your Atlas cluster using the same connection string or the dedicated Compass connection string from Atlas.

### Troubleshooting

- If you do not have local MongoDB installed, the backend will crash with `connect ECONNREFUSED 127.0.0.1:27017`.
- Use MongoDB Atlas or install MongoDB locally, then restart the backend.
- Make sure the backend server is started in `server/` and the frontend in `client/`.

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

### Doctors
- `GET /api/doctors`
- `GET /api/doctors/:id`
- `POST /api/doctors`
- `PUT /api/doctors/:id`
- `DELETE /api/doctors/:id`

### Appointments
- `POST /api/appointments`
- `GET /api/appointments`
- `PUT /api/appointments/:id`
- `DELETE /api/appointments/:id`

### Admin
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `GET /api/admin/doctors`
- `PUT /api/admin/doctors/:id/approve`
- `PUT /api/admin/doctors/:id/reject`
- `GET /api/admin/appointments`

## Deployment Notes

- Build the React app with `npm run build` inside `client/`.
- Point static hosting to `client/dist`.
- Run the Node server in production mode with `npm start` inside `server/`.
- Use environment variables for `MONGO_URI`, `JWT_SECRET`, and frontend base URL.

## Testing

- Use Postman to test API endpoints.
- Authenticate with `/api/auth/login` to obtain a JWT token.
- Include `Authorization: Bearer <token>` in requests to protected routes.

## Notes

- The backend serves uploaded files from `/uploads`.
- The frontend stores user data and token in `localStorage`.
- You can extend the UI with additional pages like contact, reports, and analytics charts.
