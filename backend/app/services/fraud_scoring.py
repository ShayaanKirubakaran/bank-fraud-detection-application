from datetime import timedelta

SUSPICIOUS_KEYWORDS = ["crypto", "wire transfer", "gift card", "unknown", "offshore"]


def calculate_fraud_score(transaction, user_transactions):
    score = 0
    reasons = []

    amounts = [
        float(t.amount)
        for t in user_transactions
        if t.transaction_id != transaction.transaction_id
    ]

    average_amount = sum(amounts) / len(amounts) if amounts else float(transaction.amount)
    transaction_amount = float(transaction.amount)

    if average_amount > 0 and transaction_amount > average_amount * 5:
        score += 45
        reasons.append("Transaction amount is more than 5 times the user's average transaction amount.")
    elif average_amount > 0 and transaction_amount > average_amount * 3:
        score += 30
        reasons.append("Transaction amount is more than 3 times the user's average transaction amount.")

    start_time = transaction.transaction_time - timedelta(minutes=10)
    end_time = transaction.transaction_time + timedelta(minutes=10)

    nearby_transactions = [
        t for t in user_transactions
        if start_time <= t.transaction_time <= end_time
    ]

    if len(nearby_transactions) > 5:
        score += 25
        reasons.append("More than 5 transactions occurred within a short time window.")

    categories = [
        t.merchant_category
        for t in user_transactions
        if t.transaction_id != transaction.transaction_id
    ]

    if len(categories) >= 5 and categories.count(transaction.merchant_category) <= 1:
        score += 15
        reasons.append("Transaction category is unusual compared to user's past spending.")

    locations = [
        t.transaction_location
        for t in user_transactions
        if t.transaction_location
    ]

    if len(locations) >= 5 and locations.count(transaction.transaction_location) <= 1:
        score += 20
        reasons.append("Transaction location is unusual for this user.")

    if transaction.transaction_time.hour < 5:
        score += 10
        reasons.append("Transaction occurred during unusual late-night hours.")

    merchant_lower = transaction.merchant_name.lower()

    for keyword in SUSPICIOUS_KEYWORDS:
        if keyword in merchant_lower:
            score += 15
            reasons.append(f"Merchant name contains suspicious keyword: {keyword}.")
            break

    score = min(score, 100)

    if score >= 70:
        risk_level = "high"
    elif score >= 40:
        risk_level = "medium"
    else:
        risk_level = "low"

    return {
        "score": score,
        "risk_level": risk_level,
        "reasons": reasons
    }