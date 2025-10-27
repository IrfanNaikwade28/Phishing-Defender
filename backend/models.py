from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    checks = db.relationship("Check", backref="user", lazy=True)

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)


class Check(db.Model):
    __tablename__ = "checks"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    url = db.Column(db.Text, nullable=False)
    risk_score = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), nullable=False)  # Safe, Suspicious, Phishing
    reasons = db.Column(db.Text)  # JSON stringified list of reasons
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
