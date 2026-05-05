from app.extensions import db
from datetime import datetime

class FraudAlert(db.Model):
    __tablename__ = "fraud_alerts"

    alert_id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(db.Integer, db.ForeignKey("transactions.transaction_id"), nullable=False)
    alert_reason = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(30), default="pending")
    reviewed_by = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=True)
    review_notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at = db.Column(db.DateTime)