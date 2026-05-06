# Bank Fraud Detection Application

## Overview
Bank Fraud Detection Application is a full stack fintech web application that analyzes banking transactions and flags suspicious activity using fraud risk scoring.

The goal of this project is to build a realistic banking-style application where users can register, log in, view transactions, automatically score fraud risk, and review suspicious transactions through fraud alerts.

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
- User registration with password hashing
- User login with JWT authentication
- `/api/auth/me` route to verify logged-in users
- JWT token stored in localStorage
- Protected dashboard route
- Logout functionality
- React register and login pages connected to Flask backend
- React dashboard displaying transaction data from the backend
- Transaction search by merchant name
- Transaction filtering by category and risk level
- Transaction sorting by amount, date, and fraud score
- Create, update, and delete transaction APIs
- React dashboard create, edit, and delete transaction actions
- Automatic fraud scoring for created and updated transactions
- Automatic risk level classification
- Automatic fraud alert creation for high-risk transactions
- Fraud Alerts page displaying flagged transactions
- Admin review workflow for fraud alerts
- Fraud alert status updates: pending, confirmed fraud, false positive, resolved
- Review notes and reviewed timestamp for fraud investigations

## API Routes Built So Far

### General
- `GET /`

### Transactions
- `GET /api/transactions/test`
- `GET /api/transactions/`
- `GET /api/transactions/:id`
- `POST /api/transactions/`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`

### Authentication
- `GET /api/auth/test`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Fraud
- `GET /api/fraud/test`
- `GET /api/fraud/alerts`
- `PUT /api/fraud/alerts/:id/review`

## Planned Features
- Dashboard summary cards
- Spending charts
- Fraud trend charts
- CSV export
- Deployment with Vercel and Render/Railway
- PostgreSQL production database
- Optional machine learning fraud classification model

## Local Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python seed.py
python run.py