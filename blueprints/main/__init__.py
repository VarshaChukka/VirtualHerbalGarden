from flask import Blueprint

# Define the 'main' blueprint
main_bp = Blueprint('main', __name__,
                    template_folder='../../templates', # Relative path to global templates folder
                    static_folder='../../static')      # Relative path to global static folder

# Import routes after blueprint is defined to avoid circular imports
from . import routes