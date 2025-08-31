# Routes package initialization
"""
Routes package for Paw Diary Backend

This package contains all the route blueprints for different features:
- users: User management
- pets: Pet management
"""

from .users import users_bp
from .pets import pets_bp
from .diet_logs import diet_logs_bp
from .weight_logs import weight_logs_bp
from .vaccine_logs import vaccine_logs_bp
from .reminders import reminders_bp

# Export all blueprints for easy importing
__all__ = ['users_bp', 'pets_bp', 'diet_logs_bp', 'weight_logs_bp', 'vaccine_logs_bp', 'reminders_bp']

# Package version
__version__ = '1.0.0' 