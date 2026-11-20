from flask import render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required, current_user
from . import auth_bp
from .models import User
from app import db

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        # User is already logged in, just redirect home. No need to flash "already logged in".
        return redirect(url_for('main.home'))

    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        remember = request.form.get('remember_me') == 'on'

        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):
            login_user(user, remember=remember)
            flash(f"Welcome, {user.username}!", "success") # This flash is correct
            next_page = request.args.get('next')
            return redirect(next_page or url_for('main.home'))
        else:
            flash("Login Unsuccessful. Please check email and password", "danger")
    return render_template('login.html')

@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if current_user.is_authenticated:
        # User is already logged in, just redirect home. No need to flash "already has account".
        return redirect(url_for('main.home'))

    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')

        if not username or not email or not password:
            flash("All fields are required.", "danger")
            return render_template('signup.html', username=username, email=email)

        existing_user_username = User.query.filter_by(username=username).first()
        existing_user_email = User.query.filter_by(email=email).first()

        if existing_user_username:
            flash("Username already exists. Please choose a different one.", "danger")
            return render_template('signup.html', email=email)
        if existing_user_email:
            flash("Email already registered. Please use a different email or login.", "danger")
            return render_template('signup.html', username=username)

        new_user = User(username=username, email=email)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()
        flash("Account created successfully! You can now log in.", "success") # This flash is correct
        return redirect(url_for('auth.login'))

    return render_template('signup.html')

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash("You have been logged out.", "info") # This flash is correct
    return redirect(url_for('main.home'))


# ... (your existing imports and login/signup routes) ...

# Example of a protected route (e.g., a user's profile page)
@auth_bp.route('/profile')
@login_required # This decorator ensures only logged-in users can access this page
def profile():
    # Render a profile template, passing the current_user object to it
    # You'll need to create a profile.html template in your templates folder
    return render_template('profile.html', user=current_user)