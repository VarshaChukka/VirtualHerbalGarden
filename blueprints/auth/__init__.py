from flask import Blueprint

# Define the 'auth' blueprint
auth_bp = Blueprint('auth', __name__,
                    url_prefix='/auth',              # All routes in auth blueprint will start with /auth
                    template_folder='../../templates', # Relative path to global templates folder
                    static_folder='../../static')      # Relative path to global static folder

# Import routes after blueprint is defined
from . import routes