from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, migrate, jwt
from flask import jsonify


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # CORS
    CORS(app, supports_credentials=Config.CORS_SUPPORTS_CREDENTIALS, origins=Config.CORS_ORIGINS)

    # Ensure models are registered for migrations
    from models import User, Check  # noqa: F401

    # Register blueprints
    from routes.auth_routes import auth_bp
    from routes.check_routes import check_bp
    from routes.user_routes import user_bp

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(check_bp, url_prefix="/api")
    app.register_blueprint(user_bp, url_prefix="/api")

    # Ensure SQLite tables exist in dev without requiring migrations
    # This is a convenience for local runs; migrations are still recommended.
    with app.app_context():
        db.create_all()

    # Helpful JWT error responses for debugging
    @jwt.unauthorized_loader
    def _unauth(msg):
        return jsonify({"error": "Unauthorized", "msg": msg}), 401

    @jwt.invalid_token_loader
    def _invalid(msg):
        return jsonify({"error": "Invalid token", "msg": msg}), 422

    @jwt.expired_token_loader
    def _expired(header, payload):
        return jsonify({"error": "Token expired"}), 401

    @jwt.needs_fresh_token_loader
    def _fresh_required(msg):
        return jsonify({"error": "Fresh token required", "msg": msg}), 401

    @app.get("/api/health")
    def health():
        return {"status": "ok"}, 200

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
