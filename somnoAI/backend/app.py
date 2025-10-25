"""
SonmoAI Flask Backend
Smart Adaptive Alarm System with Gemini AI Integration

Main application file that initializes Flask and registers blueprints.
"""

from flask import Flask
from flask_cors import CORS
from config import Config

def create_app(config_class=Config):
    """
    Application factory pattern for creating Flask app instance.
    Initializes extensions and registers blueprints.
    """
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS for mobile app requests
    CORS(app, origins=["*"])  # Allow all origins for development
    
    # Register blueprints
    from routes.quiz import quiz_bp
    from routes.alarm import alarm_bp
    from routes.auth import auth_bp
    
    app.register_blueprint(quiz_bp, url_prefix='/api/quiz')
    app.register_blueprint(alarm_bp, url_prefix='/api/alarm')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    @app.route('/')
    def health_check():
        """Health check endpoint for monitoring."""
        return {
            'status': 'healthy',
            'service': 'SonmoAI Backend',
            'version': '1.0.0'
        }
    
    return app

if __name__ == '__main__':
    app = create_app()
    print("\n🌙 SonmoAI Backend Server Starting...")
    print("📍 Server running at: http://localhost:5001")
    print("📚 API Documentation: Check README.md for endpoints\n")
    app.run(debug=True, host='0.0.0.0', port=5001)
