# Bank Fraud Detection Application

## Overview
Bank Fraud Detection Application is a full stack fintech web application that analyzes banking transactions and flags suspicious activity using fraud risk scoring.

## Tech Stack
- Frontend: React, Vite, Axios
- Backend: Python, Flask, Flask-SQLAlchemy
- Database: SQLite for local development, PostgreSQL planned for production
- Data Analysis: pandas
- Charts: Recharts

## Current Features
- Flask backend setup
- React frontend setup
- Database models for users, accounts, transactions, and fraud alerts
- Seed data for sample users, accounts, transactions, and fraud alerts
- API endpoint to fetch all transactions
- API endpoint to fetch a single transaction by ID
- React table displaying transaction data from the backend

## API Routes Built So Far
- `GET /`
- `GET /api/transactions/test`
- `GET /api/transactions/`
- `GET /api/transactions/:id`

## Planned Features
- User authentication
- Fraud scoring engine
- Transaction search and filtering
- Dashboard summary cards
- Spending charts
- Fraud alerts page
- Admin review workflow
- CSV export

## Local Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python run.py