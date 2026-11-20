from flask import Flask, render_template, redirect, url_for, flash, g # Import 'g' for global context
import os
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, current_user

# Initialize extensions
db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)

    # --- Basic Configuration ---
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'a-simple-secret-key-that-is-hard-to-guess' # Crucial for security
    app.config['DEBUG'] = True
    app.config['TESTING'] = False

    # Configure SQLite Database
    # This creates a 'site.db' file in your project's root directory
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # Disable signals, saving resources

    # Initialize extensions with the app
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login' # Where Flask-Login should redirect for login
    login_manager.login_message_category = 'info'
    login_manager.login_message = 'Please log in to access this page.'

    # User loader callback for Flask-Login
    # This function is used to reload the user object from the user ID stored in the session
    @login_manager.user_loader
    def load_user(user_id):
        # We import User here to avoid circular import with blueprints
        from blueprints.auth.models import User
        return User.query.get(int(user_id))

    # --- Register Blueprints ---
    from blueprints.main import main_bp
    from blueprints.auth import auth_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)

    # --- Global Context Processor for Nav (Optional but Recommended) ---
    # This makes 'current_user' available in all templates without passing it explicitly
    @app.context_processor
    def inject_user():
        return dict(current_user=current_user)

    # --- Global Error Handler ---
    @app.errorhandler(404)
    def not_found_error(error):
        return render_template('404.html'), 404

    return app

if __name__ == '__main__':
    app = create_app()

    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()

    app.run(host='0.0.0.0', port=5000)