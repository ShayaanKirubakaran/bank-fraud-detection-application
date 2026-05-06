# Bank Fraud Detection Application

## Live Demo
- Frontend: `https://your-vercel-url.vercel.app`
- Backend API: `https://bank-fraud-detection-application.onrender.com`

## Overview
Bank Fraud Detection Application is a full stack fintech web application that analyzes banking transactions and flags suspicious activity using fraud risk scoring.

The goal of this project is to build a realistic banking-style application where users can register, log in, view transactions, automatically score fraud risk, review suspicious transactions through fraud alerts, export reports, and visualize banking activity through dashboard analytics.

## Tech Stack
- Frontend: React, Vite, Axios, React Router, Recharts
- Backend: Python, Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-CORS
- Authentication: bcrypt, JWT
- Database: SQLite for local development, Render-hosted database for deployment
- Data Analysis: pandas
- Charts: Recharts
- Exporting: CSV
- Deployment: Vercel frontend, Render backend

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
- Dashboard summary cards for total transactions, total spending, high-risk transactions, pending fraud alerts, and average fraud score
- Spending by category bar chart using Recharts
- Transactions by risk level pie chart using Recharts
- CSV export for transactions
- CSV export for fraud alerts
- Frontend download buttons for transaction and fraud alert reports
- Professional UI styling with cards, tables, badges, and responsive layout
- Deployed frontend and backend

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

### Dashboard
- `GET /api/dashboard/summary`

### Export
- `GET /api/export/transactions-csv`
- `GET /api/export/fraud-alerts-csv`

## Project Structure

```text
bank-fraud-detection-application/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── account.py
│   │   │   ├── transaction.py
│   │   │   └── fraud_alert.py
│   │   │
│   │   ├── routes/
│   │   │   ├── auth_routes.py
│   │   │   ├── dashboard_routes.py
│   │   │   ├── export_routes.py
│   │   │   ├── fraud_routes.py
│   │   │   └── transaction_routes.py
│   │   │
│   │   ├── services/
│   │   │   └── fraud_scoring.py
│   │   │
│   │   ├── utils/
│   │   │   └── seed_data.py
│   │   │
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── extensions.py
│   │
│   ├── migrations/
│   ├── requirements.txt
│   ├── run.py
│   └── seed.py
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── apiClient.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FraudAlerts.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── vercel.json
│   └── package.json
│
├── README.md
└── .gitignore