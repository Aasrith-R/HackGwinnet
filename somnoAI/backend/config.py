"""
Configuration settings for SonmoAI Flask Backend
"""

import os
from datetime import timedelta

class Config:
    """
    Configuration class for Flask application.
    Stores all environment variables and settings.
    """
    
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    JSONIFY_PRETTYPRINT_REGULAR = True
    
    # Supabase configuration
    SUPABASE_URL = os.environ.get('SUPABASE_URL') or 'https://your-project.supabase.co'
    SUPABASE_KEY = os.environ.get('SUPABASE_KEY') or 'your-anon-key'
    SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_KEY') or 'your-service-key'
    
    # Gemini API configuration
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY') or 'AIzaSyCiVDwhkxZvDBWTf3Ancoo6o_ZK6w_JbIQ'
    GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
    
    # Alarm configuration defaults
    DEFAULT_WAKE_UP_DURATION = 15  # minutes
    DEFAULT_VOLUME_RAMP = 5  # minutes
    DEFAULT_TOTAL_DURATION = 20  # minutes
    
    # Feedback metrics
    MIN_HAPPINESS_RATING = 1
    MAX_HAPPINESS_RATING = 5
    
    # Database query limits
    MAX_ALARM_HISTORY = 50
    MAX_FEEDBACK_HISTORY = 50
