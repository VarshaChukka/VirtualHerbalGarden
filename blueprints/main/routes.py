from flask import render_template
from . import main_bp # Import main_bp from its __init__.py

# Home
@main_bp.route('/')
def home():
    return render_template('index.html')

# Plants listing
@main_bp.route('/plants')
def plants():
    return render_template('plants.html')

# Single plant detail
@main_bp.route('/plant/<plant_key>')
def plant_detail(plant_key):
    return render_template('plants_detail.html', plant_key=plant_key)

# Gallery
@main_bp.route('/gallery/<plant_key>')
def gallery(plant_key):
    return render_template('full_gallery.html', plant_key=plant_key)

# Diseases listing
@main_bp.route('/diseases')
def diseases():
    return render_template('diseases.html')

# Single disease detail
@main_bp.route('/disease/<disease_key>')
def disease_detail(disease_key):
    return render_template('disease_detail.html', disease_key=disease_key)

