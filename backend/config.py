import os
from datetime import timedelta

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///phishing.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me-in-prod")
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_TYPE = "Bearer"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)

    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    CORS_SUPPORTS_CREDENTIALS = True

    # Optional: allow proxies if deployed behind one
    PREFERRED_URL_SCHEME = "https" if os.getenv("FLASK_ENV") == "production" else "http"
