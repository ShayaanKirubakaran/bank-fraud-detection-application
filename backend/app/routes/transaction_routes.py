from flask import Blueprint, jsonify
from app.models import Transaction

transaction_bp = Blueprint("transactions", __name__)

@transaction_bp.route("/test", methods=["GET"])
def test_transactions():
    return {
        "message": "Transaction routes are working"
    }

@transaction_bp.route("/", methods=["GET"])
def get_transactions():
    transactions = Transaction.query.all()

    transaction_list = []

    for transaction in transactions:
        transaction_list.append({
            "transaction_id": transaction.transaction_id,
            "account_id": transaction.account_id,
            "amount": float(transaction.amount),
            "merchant_name": transaction.merchant_name,
            "merchant_category": transaction.merchant_category,
            "transaction_location": transaction.transaction_location,
            "transaction_time": transaction.transaction_time.isoformat(),
            "transaction_type": transaction.transaction_type,
            "fraud_score": transaction.fraud_score,
            "risk_level": transaction.risk_level
        })

    return jsonify(transaction_list)

@transaction_bp.route("/<int:transaction_id>", methods=["GET"])
def get_transaction_by_id(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)

    return jsonify({
        "transaction_id": transaction.transaction_id,
        "account_id": transaction.account_id,
        "amount": float(transaction.amount),
        "merchant_name": transaction.merchant_name,
        "merchant_category": transaction.merchant_category,
        "transaction_location": transaction.transaction_location,
        "transaction_time": transaction.transaction_time.isoformat(),
        "transaction_type": transaction.transaction_type,
        "fraud_score": transaction.fraud_score,
        "risk_level": transaction.risk_level
    })