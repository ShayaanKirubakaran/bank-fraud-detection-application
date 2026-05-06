from flask import Blueprint, jsonify
from app.models import Transaction, FraudAlert
from sqlalchemy import func

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/summary", methods=["GET"])
def get_dashboard_summary():
    total_transactions = Transaction.query.count()

    total_spending_result = db_total_spending()
    average_fraud_score_result = db_average_fraud_score()

    high_risk_transactions = Transaction.query.filter_by(risk_level="high").count()
    pending_fraud_alerts = FraudAlert.query.filter_by(status="pending").count()

    return jsonify({
        "total_transactions": total_transactions,
        "total_spending": total_spending_result,
        "high_risk_transactions": high_risk_transactions,
        "pending_fraud_alerts": pending_fraud_alerts,
        "average_fraud_score": average_fraud_score_result
    })


def db_total_spending():
    result = Transaction.query.with_entities(
        func.sum(Transaction.amount)
    ).scalar()

    return float(result) if result else 0.0


def db_average_fraud_score():
    result = Transaction.query.with_entities(
        func.avg(Transaction.fraud_score)
    ).scalar()

    return round(float(result), 2) if result else 0.0