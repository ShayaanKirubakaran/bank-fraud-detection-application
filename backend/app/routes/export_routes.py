from flask import Blueprint, Response
from app.models import Transaction, FraudAlert
import csv
from io import StringIO

export_bp = Blueprint("export", __name__)


@export_bp.route("/transactions-csv", methods=["GET"])
def export_transactions_csv():
    transactions = Transaction.query.order_by(Transaction.transaction_time.desc()).all()

    output = StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "Transaction ID",
        "Account ID",
        "Amount",
        "Merchant Name",
        "Merchant Category",
        "Location",
        "Transaction Time",
        "Transaction Type",
        "Fraud Score",
        "Risk Level",
    ])

    for transaction in transactions:
        writer.writerow([
            transaction.transaction_id,
            transaction.account_id,
            float(transaction.amount),
            transaction.merchant_name,
            transaction.merchant_category,
            transaction.transaction_location,
            transaction.transaction_time.isoformat(),
            transaction.transaction_type,
            transaction.fraud_score,
            transaction.risk_level,
        ])

    csv_data = output.getvalue()
    output.close()

    return Response(
        csv_data,
        mimetype="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=transactions.csv"
        },
    )


@export_bp.route("/fraud-alerts-csv", methods=["GET"])
def export_fraud_alerts_csv():
    alerts = FraudAlert.query.order_by(FraudAlert.created_at.desc()).all()

    output = StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "Alert ID",
        "Transaction ID",
        "Alert Reason",
        "Status",
        "Reviewed By",
        "Review Notes",
        "Created At",
        "Reviewed At",
    ])

    for alert in alerts:
        writer.writerow([
            alert.alert_id,
            alert.transaction_id,
            alert.alert_reason,
            alert.status,
            alert.reviewed_by,
            alert.review_notes,
            alert.created_at.isoformat() if alert.created_at else "",
            alert.reviewed_at.isoformat() if alert.reviewed_at else "",
        ])

    csv_data = output.getvalue()
    output.close()

    return Response(
        csv_data,
        mimetype="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=fraud_alerts.csv"
        },
    )