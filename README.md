# Bank Fraud Detection Application

## Overview
Bank Fraud Detection Application is a full stack fintech web application that analyzes banking transactions and flags suspicious activity using fraud risk scoring.

The goal of this project is to build a realistic banking-style application where users can register, log in, view transactions, and eventually review suspicious transactions through fraud alerts and risk scores.

## Tech Stack
- Frontend: React, Vite, Axios, React Router, Recharts
- Backend: Python, Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-CORS
- Authentication: bcrypt, JWT
- Database: SQLite for local development, PostgreSQL planned for production
- Data Analysis: pandas

## Current Features
- Flask backend setup
- React frontend setup
- Database models for users, accounts, transactions, and fraud alerts
- Database migrations using Flask-Migrate
- Seed data for sample users, accounts, transactions, and fraud alerts
- API endpoint to fetch all transactions
- API endpoint to fetch a single transaction by ID
- React dashboard displaying transaction data from the backend
- User registration with password hashing
- User login with JWT authentication
- `/api/auth/me` route to verify logged-in users
- React register page connected to Flask backend
- React login page connected to Flask backend
- JWT token stored in localStorage
- Protected dashboard route
- Logout functionality

## API Routes Built So Far

### General
- `GET /`

### Transactions
- `GET /api/transactions/test`
- `GET /api/transactions/`
- `GET /api/transactions/:id`

### Authentication
- `GET /api/auth/test`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Planned Features
- Transaction search and filtering
- Transaction sorting
- Create, update, and delete transaction APIs
- Fraud scoring engine
- Risk levels: low, medium, high
- Dashboard summary cards
- Spending charts
- Fraud trend charts
- Fraud alerts page
- Admin review workflow
- CSV export
- Deployment with Vercel and Render/Railway
- PostgreSQL production database

## Local Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python seed.py
python run.py