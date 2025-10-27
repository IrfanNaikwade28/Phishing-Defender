from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from extensions import db
from models import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return {"error": "Email and password are required"}, 400

    user = User(email=email)
    user.set_password(password)

    try:
        db.session.add(user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "Email already registered"}, 409

    return {"message": "User registered successfully"}, 201


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = User.query.filter_by(email=email).first()

    if not user or not user.verify_password(password):
        return {"error": "Invalid credentials"}, 401

    # Use string identity to avoid "Subject must be a string" (422) with PyJWT
    token = create_access_token(identity=str(user.id))
    return {"access_token": token, "user": {"id": user.id, "email": user.email}}, 200


@auth_bp.get("/profile")
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return {"id": user.id, "email": user.email, "created_at": user.created_at.isoformat()}, 200
