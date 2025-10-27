from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Check
from utils.analyzer import analyze_url
import json

check_bp = Blueprint("check", __name__)


@check_bp.post("/check-url")
@jwt_required()
def check_url():
    data = request.get_json() or {}
    url = data.get("url", "").strip()

    if not url:
        return {"error": "URL is required"}, 400

    result = analyze_url(url)

    check = Check(
        user_id=int(get_jwt_identity()),
        url=url,
        risk_score=result["risk_score"],
        status=result["status"],
        reasons=json.dumps(result["reasons"]),
    )
    db.session.add(check)
    db.session.commit()

    return result, 200


@check_bp.get("/history")
@jwt_required()
def history():
    user_id = int(get_jwt_identity())
    rows = (
        Check.query.filter_by(user_id=user_id)
        .order_by(Check.created_at.desc())
        .limit(200)
        .all()
    )

    history_list = [
        {
            "id": r.id,
            "url": r.url,
            "risk_score": r.risk_score,
            "status": r.status,
            "reasons": json.loads(r.reasons or "[]"),
            "created_at": r.created_at.isoformat(),
        }
        for r in rows
    ]

    return {"history": history_list}, 200
