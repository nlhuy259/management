# Project Management System

A full-stack project management application built with Next.js, Express.js, and MySQL. This system provides task management, real-time messaging, and user authentication features.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Task Management**: Create, assign, and track tasks with different statuses
- **Real-time Messaging**: Socket.io powered chat system
- **Dashboard**: Overview of tasks and recent messages
- **User Management**: Profile management and user roles
- **Responsive Design**: Modern UI built with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling framework
- **Socket.io Client** - Real-time communication

### Backend
- **Express.js 5.1.0** - Web framework
- **TypeScript** - Type safety
- **Prisma 6.15.0** - Database ORM
- **MySQL** - Database
- **Socket.io 4.8.1** - Real-time communication
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📁 Project Structure

```
management/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── dashboard/   # Dashboard page
│   │   │   ├── login/       # Login page
│   │   │   ├── register/    # Registration page
│   │   │   ├── tasks/       # Task management pages
│   │   │   ├── messages/    # Messaging page
│   │   │   └── user/        # User profile page
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   └── ...
│   └── package.json
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Custom middlewares
│   │   ├── sockets/         # Socket.io handlers
│   │   └── utils/           # Utility functions
│   ├── prisma/              # Database schema
│   └── package.json
└── README.md
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd management
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/management_db"
   JWT_SECRET="your-jwt-secret-key"
   PORT=5000
   ```

5. **Set up the database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

6. **Start the development servers**

   Backend (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📊 Database Schema

The application uses the following main entities:

- **User**: User accounts with roles (USER, MANAGER)
- **Task**: Project tasks with status tracking
- **Message**: Real-time messaging between users

### Task Statuses
- `TODO` - Task created but not started
- `IN_PROGRESS` - Task currently being worked on
- `REVIEW` - Task completed and under review
- `DONE` - Task fully completed