"""
Auth Route
Basic authentication endpoints (placeholder for now).
"""

from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/test', methods=['GET'])
def test_auth():
    """
    Test authentication endpoint.
    
    Returns:
        JSON response confirming auth route is working
    """
    return jsonify({
        'success': True,
        'message': 'Auth route is working'
    }), 200
