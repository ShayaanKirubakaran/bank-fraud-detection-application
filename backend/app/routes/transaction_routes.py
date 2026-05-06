from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models import Transaction
from app.services.fraud_scoring import calculate_fraud_score
from datetime import datetime

transaction_bp = Blueprint("transactions", __name__)


def transaction_to_dict(transaction):
    return {
        "transaction_id": transaction.transaction_id,
        "account_id": transaction.account_id,
        "amount": float(transaction.amount),
        "merchant_name": transaction.merchant_name,
        "merchant_category": transaction.merchant_category,
        "transaction_location": transaction.transaction_location,
        "transaction_time": transaction.transaction_time.isoformat(),
        "transaction_type": transaction.transaction_type,
        "fraud_score": transaction.fraud_score,
        "risk_level": transaction.risk_level,
    }


@transaction_bp.route("/test", methods=["GET"])
def test_transactions():
    return {
        "message": "Transaction routes are working"
    }


@transaction_bp.route("/", methods=["GET"])
def get_transactions():
    search = request.args.get("search")
    category = request.args.get("category")
    risk = request.args.get("risk")
    sort = request.args.get("sort")

    query = Transaction.query

    if search:
        query = query.filter(Transaction.merchant_name.ilike(f"%{search}%"))

    if category:
        query = query.filter(Transaction.merchant_category.ilike(category))

    if risk:
        query = query.filter(Transaction.risk_level.ilike(risk))

    if sort == "amount_asc":
        query = query.order_by(Transaction.amount.asc())
    elif sort == "amount_desc":
        query = query.order_by(Transaction.amount.desc())
    elif sort == "date_asc":
        query = query.order_by(Transaction.transaction_time.asc())
    elif sort == "date_desc":
        query = query.order_by(Transaction.transaction_time.desc())
    elif sort == "fraud_score_asc":
        query = query.order_by(Transaction.fraud_score.asc())
    elif sort == "fraud_score_desc":
        query = query.order_by(Transaction.fraud_score.desc())
    else:
        query = query.order_by(Transaction.transaction_time.desc())

    transactions = query.all()

    return jsonify([transaction_to_dict(transaction) for transaction in transactions])


@transaction_bp.route("/", methods=["POST"])
def create_transaction():
    data = request.get_json()

    required_fields = [
        "account_id",
        "amount",
        "merchant_name",
        "merchant_category",
        "transaction_location",
        "transaction_time",
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required."}), 400

    try:
        transaction_time = datetime.fromisoformat(data["transaction_time"])

        new_transaction = Transaction(
            account_id=data["account_id"],
            amount=data["amount"],
            merchant_name=data["merchant_name"],
            merchant_category=data["merchant_category"],
            transaction_location=data["transaction_location"],
            transaction_time=transaction_time,
            transaction_type=data.get("transaction_type", "purchase"),
            fraud_score=0,
            risk_level="low",
        )

        db.session.add(new_transaction)
        db.session.flush()

        user_transactions = Transaction.query.filter_by(
            account_id=new_transaction.account_id
        ).all()

        fraud_result = calculate_fraud_score(new_transaction, user_transactions)

        new_transaction.fraud_score = fraud_result["score"]
        new_transaction.risk_level = fraud_result["risk_level"]

        db.session.commit()

        return jsonify({
            "message": "Transaction created successfully.",
            "transaction": transaction_to_dict(new_transaction),
            "fraud_reasons": fraud_result["reasons"],
        }), 201

    except ValueError:
        return jsonify({
            "error": "Invalid transaction_time format. Use YYYY-MM-DDTHH:MM:SS."
        }), 400


@transaction_bp.route("/<int:transaction_id>", methods=["GET"])
def get_transaction_by_id(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    return jsonify(transaction_to_dict(transaction))


@transaction_bp.route("/<int:transaction_id>", methods=["PUT"])
def update_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    data = request.get_json()

    if "amount" in data:
        transaction.amount = data["amount"]

    if "merchant_name" in data:
        transaction.merchant_name = data["merchant_name"]

    if "merchant_category" in data:
        transaction.merchant_category = data["merchant_category"]

    if "transaction_location" in data:
        transaction.transaction_location = data["transaction_location"]

    if "transaction_time" in data:
        try:
            transaction.transaction_time = datetime.fromisoformat(data["transaction_time"])
        except ValueError:
            return jsonify({
                "error": "Invalid transaction_time format. Use YYYY-MM-DDTHH:MM:SS."
            }), 400

    if "transaction_type" in data:
        transaction.transaction_type = data["transaction_type"]

    user_transactions = Transaction.query.filter_by(
        account_id=transaction.account_id
    ).all()

    fraud_result = calculate_fraud_score(transaction, user_transactions)

    transaction.fraud_score = fraud_result["score"]
    transaction.risk_level = fraud_result["risk_level"]

    db.session.commit()

    return jsonify({
        "message": "Transaction updated successfully.",
        "transaction": transaction_to_dict(transaction),
        "fraud_reasons": fraud_result["reasons"],
    })


@transaction_bp.route("/<int:transaction_id>", methods=["DELETE"])
def delete_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)

    db.session.delete(transaction)
    db.session.commit()

    return jsonify({
        "message": "Transaction deleted successfully."
    })