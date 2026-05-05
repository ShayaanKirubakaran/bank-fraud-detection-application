from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import User
import bcrypt
import jwt
import os
from datetime import datetime, timedelta

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/test", methods=["GET"])
def test_auth():
    return {
        "message": "Auth routes are working"
    }


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")

    if not full_name or not email or not password:
        return jsonify({"error": "Full name, email, and password are required."}), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({"error": "Email is already registered."}), 409

    password_bytes = password.encode("utf-8")
    hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())

    new_user = User(
        full_name=full_name,
        email=email,
        password_hash=hashed_password.decode("utf-8"),
        role="user"
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully.",
        "user": {
            "user_id": new_user.user_id,
            "full_name": new_user.full_name,
            "email": new_user.email,
            "role": new_user.role
        }
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "Invalid email or password."}), 401

    password_matches = bcrypt.checkpw(
        password.encode("utf-8"),
        user.password_hash.encode("utf-8")
    )

    if not password_matches:
        return jsonify({"error": "Invalid email or password."}), 401

    payload = {
        "user_id": user.user_id,
        "email": user.email,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(hours=2)
    }

    token = jwt.encode(
        payload,
        os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-key"),
        algorithm="HS256"
    )

    return jsonify({
        "message": "Login successful.",
        "token": token,
        "user": {
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        }
    })

@auth_bp.route("/me", methods=["GET"])
def get_current_user():
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return jsonify({"error": "Authorization header is missing."}), 401

    try:
        token = auth_header.split(" ")[1]

        decoded_token = jwt.decode(
            token,
            os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-key"),
            algorithms=["HS256"]
        )

        user = db.session.get(User, decoded_token["user_id"])

        if not user:
            return jsonify({"error": "User not found."}), 404

        return jsonify({
            "user": {
                "user_id": user.user_id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role
            }
        })

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired."}), 401

    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token."}), 401

    except IndexError:
        return jsonify({"error": "Invalid Authorization header format."}), 401