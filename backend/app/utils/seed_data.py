from datetime import datetime, timedelta
from app.extensions import db
from app.models import User, Account, Transaction, FraudAlert


def seed_database():
    # Clear old data first so we do not duplicate rows every time
    FraudAlert.query.delete()
    Transaction.query.delete()
    Account.query.delete()
    User.query.delete()

    # Create test users
    user1 = User(
        full_name="Shayaan Kirubakaran",
        email="shayaan@example.com",
        password_hash="fake_hashed_password",
        role="user"
    )

    admin = User(
        full_name="Admin User",
        email="admin@example.com",
        password_hash="fake_hashed_password",
        role="admin"
    )

    db.session.add(user1)
    db.session.add(admin)
    db.session.commit()

    # Create bank accounts
    chequing = Account(
        user_id=user1.user_id,
        account_name="Everyday Chequing",
        account_type="chequing",
        balance=2450.75
    )

    savings = Account(
        user_id=user1.user_id,
        account_name="High Interest Savings",
        account_type="savings",
        balance=8500.00
    )

    db.session.add(chequing)
    db.session.add(savings)
    db.session.commit()

    now = datetime.utcnow()

    # Create normal transactions
    transactions = [
        Transaction(
            account_id=chequing.account_id,
            amount=18.45,
            merchant_name="Tim Hortons",
            merchant_category="Food",
            transaction_location="Toronto",
            transaction_time=now - timedelta(days=1, hours=2),
            transaction_type="purchase",
            fraud_score=5,
            risk_level="low"
        ),
        Transaction(
            account_id=chequing.account_id,
            amount=74.20,
            merchant_name="Walmart",
            merchant_category="Groceries",
            transaction_location="Toronto",
            transaction_time=now - timedelta(days=2),
            transaction_type="purchase",
            fraud_score=10,
            risk_level="low"
        ),
        Transaction(
            account_id=chequing.account_id,
            amount=32.10,
            merchant_name="Presto",
            merchant_category="Transportation",
            transaction_location="Toronto",
            transaction_time=now - timedelta(days=3),
            transaction_type="purchase",
            fraud_score=8,
            risk_level="low"
        ),
        Transaction(
            account_id=savings.account_id,
            amount=500.00,
            merchant_name="Transfer to Chequing",
            merchant_category="Transfer",
            transaction_location="Toronto",
            transaction_time=now - timedelta(days=4),
            transaction_type="transfer",
            fraud_score=15,
            risk_level="low"
        ),

        # Suspicious transaction example
        Transaction(
            account_id=chequing.account_id,
            amount=2400.00,
            merchant_name="Unknown Offshore Crypto",
            merchant_category="Crypto",
            transaction_location="Miami",
            transaction_time=now.replace(hour=2, minute=30, second=0, microsecond=0),
            transaction_type="purchase",
            fraud_score=90,
            risk_level="high"
        )
    ]

    db.session.add_all(transactions)
    db.session.commit()

    # Create fraud alert for the suspicious transaction
    suspicious_transaction = Transaction.query.filter_by(risk_level="high").first()

    fraud_alert = FraudAlert(
        transaction_id=suspicious_transaction.transaction_id,
        alert_reason="High-value transaction at unusual hour from unusual location with suspicious merchant keyword.",
        status="pending"
    )

    db.session.add(fraud_alert)
    db.session.commit()

    print("Database seeded successfully.")
