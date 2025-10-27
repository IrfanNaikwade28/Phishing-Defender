from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User

user_bp = Blueprint("user", __name__)


@user_bp.post("/profile/password")
@jwt_required()
def update_password():
    data = request.get_json() or {}
    new_password = data.get("new_password")

    if not new_password or len(new_password) < 6:
        return {"error": "Password must be at least 6 characters"}, 400

    user = User.query.get(int(get_jwt_identity()))
    user.set_password(new_password)
    db.session.commit()

    return {"message": "Password updated"}, 200
