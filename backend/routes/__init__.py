# Routes package initialization
"""
Routes package for Paw Diary Backend

This package contains all the route blueprints for different features:
- users: User management
- pets: Pet management
"""

from .users import users_bp
from .pets import pets_bp

# Export all blueprints for easy importing
__all__ = ['users_bp', 'pets_bp']

# Package version
__version__ = '1.0.0' 