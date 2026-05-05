from app.extensions import db
from datetime import datetime

class Transaction(db.Model):
    __tablename__ = "transactions"

    transaction_id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.account_id"), nullable=False)
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    merchant_name = db.Column(db.String(150), nullable=False)
    merchant_category = db.Column(db.String(100), nullable=False)
    transaction_location = db.Column(db.String(100))
    transaction_time = db.Column(db.DateTime, nullable=False)
    transaction_type = db.Column(db.String(50), default="purchase")
    fraud_score = db.Column(db.Integer, default=0)
    risk_level = db.Column(db.String(20), default="low")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)