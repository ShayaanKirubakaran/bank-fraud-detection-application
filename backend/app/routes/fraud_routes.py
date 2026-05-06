from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models import FraudAlert, Transaction
from datetime import datetime

fraud_bp = Blueprint("fraud", __name__)


def fraud_alert_to_dict(alert):
    transaction = Transaction.query.get(alert.transaction_id)

    return {
        "alert_id": alert.alert_id,
        "transaction_id": alert.transaction_id,
        "alert_reason": alert.alert_reason,
        "status": alert.status,
        "reviewed_by": alert.reviewed_by,
        "review_notes": alert.review_notes,
        "created_at": alert.created_at.isoformat() if alert.created_at else None,
        "reviewed_at": alert.reviewed_at.isoformat() if alert.reviewed_at else None,
        "transaction": {
            "transaction_id": transaction.transaction_id,
            "amount": float(transaction.amount),
            "merchant_name": transaction.merchant_name,
            "merchant_category": transaction.merchant_category,
            "transaction_location": transaction.transaction_location,
            "transaction_time": transaction.transaction_time.isoformat(),
            "fraud_score": transaction.fraud_score,
            "risk_level": transaction.risk_level,
        } if transaction else None
    }


@fraud_bp.route("/test", methods=["GET"])
def test_fraud_routes():
    return {
        "message": "Fraud routes are working"
    }


@fraud_bp.route("/alerts", methods=["GET"])
def get_fraud_alerts():
    alerts = FraudAlert.query.order_by(FraudAlert.created_at.desc()).all()

    return jsonify([fraud_alert_to_dict(alert) for alert in alerts])


@fraud_bp.route("/alerts/<int:alert_id>/review", methods=["PUT"])
def review_fraud_alert(alert_id):
    alert = FraudAlert.query.get_or_404(alert_id)
    data = request.get_json()

    status = data.get("status")
    review_notes = data.get("review_notes", "")
    reviewed_by = data.get("reviewed_by")

    allowed_statuses = ["pending", "confirmed fraud", "false positive", "resolved"]

    if status not in allowed_statuses:
        return jsonify({
            "error": "Invalid status. Use pending, confirmed fraud, false positive, or resolved."
        }), 400

    alert.status = status
    alert.review_notes = review_notes
    alert.reviewed_by = reviewed_by
    alert.reviewed_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "message": "Fraud alert reviewed successfully.",
        "alert": fraud_alert_to_dict(alert)
    })