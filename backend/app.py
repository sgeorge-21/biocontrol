"""
Liberia Malaria Diagnosis & Early Warning System Backend
Main Flask application
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import blueprints
from routes.chat import chat_bp
from routes.epidemiology import epidemiology_bp
from routes.facilities import facilities_bp
from routes.education import education_bp
from routes.auth import auth_bp

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    # Configuration
    app.config['ENV'] = os.getenv('FLASK_ENV', 'development')
    app.config['DEBUG'] = os.getenv('FLASK_DEBUG', False)
    
    # CORS Configuration
    cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
    CORS(app, resources={r"/api/*": {"origins": cors_origins}})
    
    # Register blueprints
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(epidemiology_bp, url_prefix='/api/epidemiology')
    app.register_blueprint(facilities_bp, url_prefix='/api/facilities')
    app.register_blueprint(education_bp, url_prefix='/api/education')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health():
        return jsonify({'status': 'healthy', 'message': 'Backend is running'})
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
