from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.extensions import db, migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)

    from app.models import User, Account, Transaction, FraudAlert

    from app.routes.transaction_routes import transaction_bp
    app.register_blueprint(transaction_bp, url_prefix="/api/transactions")

    from app.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    from app.routes.fraud_routes import fraud_bp
    app.register_blueprint(fraud_bp, url_prefix="/api/fraud")

    from app.routes.dashboard_routes import dashboard_bp
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

    @app.route("/")
    def home():
        return {"message": "Bank Fraud Detection Application API is running"}

    return app