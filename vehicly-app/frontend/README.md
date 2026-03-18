# Vehicly Application

Vehicly is a full-stack vehicle marketplace app built with React, Node.js, Express, and MongoDB.

The app supports:
- User registration and login
- Role-based access (normal user and admin)
- Vehicle browsing by category
- Add to cart and checkout flow
- Admin inventory management (create and delete vehicles)

## Roles and Access

### Normal User
- Can register from the Sign Up form
- Can login and view dashboard
- Can browse categories and vehicles
- Can add vehicles to cart
- Can checkout from cart

### Admin
- Can do everything normal users can do
- Can access admin panel
- Can create and delete vehicle listings

Security note:
- Public registration always creates role user.
- Admin access is protected by role checks.

## Tech Stack

- Frontend: React, React Router, Axios, React Toastify
- Backend: Node.js, Express, Mongoose, JWT, bcryptjs
- Database: MongoDB Atlas or local MongoDB

## Project Structure

This repository has two main apps:

- backend: REST API and authentication
- frontend: React client application

## Prerequisites

- Node.js 18 or later
- npm
- MongoDB connection string

## Environment Variables

Create or update backend/.env:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

Optional frontend variable (if backend is not on localhost:5000):

REACT_APP_API_URL=http://localhost:5000

## Installation

From project root:

1. Install backend dependencies

cd backend
npm install

2. Install frontend dependencies

cd ../frontend
npm install

## Run in Development

Open two terminals.

1. Start backend

cd backend
npm run dev

2. Start frontend

cd frontend
npm start

App URLs:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Overview

Authentication:
- POST /api/auth/register
- POST /api/auth/login

Vehicles:
- GET /api/vehicles (public)
- POST /api/vehicles (admin only)
- PUT /api/vehicles/:id (admin only)
- DELETE /api/vehicles/:id (admin only)

## Frontend Scripts

Run from frontend:

- npm start: Start development server
- npm run build: Build production assets
- npm test: Run tests

## Backend Scripts

Run from backend:

- npm run dev: Start backend with nodemon
- npm start: Start backend with node

## Troubleshooting

- If login/register fails with connection errors, make sure backend is running on port 5000.
- If API responds with database errors, verify MONGO_URI and database user permissions.
- If frontend cannot call backend, confirm REACT_APP_API_URL and CORS origin settings.
