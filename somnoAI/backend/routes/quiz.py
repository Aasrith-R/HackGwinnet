"""
Quiz Route
Handles user onboarding quiz data collection and storage.
"""

from flask import Blueprint, request, jsonify
from services.supabase_service import SupabaseService

quiz_bp = Blueprint('quiz', __name__)
db = SupabaseService()

@quiz_bp.route('', methods=['POST'])
def submit_quiz():
    """
    Handle quiz submission from user onboarding.
    
    Accepts user preferences from the onboarding quiz and stores them in Supabase.
    This creates the initial user profile that will be used for AI alarm generation.
    
    Expected JSON body:
    {
        "user_id": "string (optional - if user exists)",
        "email": "string",
        "goal_wake_time": "HH:MM format",
        "wake_up_duration": integer (minutes),
        "sleep_sensitivity": "light/medium/heavy",
        "preferred_sounds": ["sound1", "sound2", ...]
    }
    
    Returns:
        JSON response with created/updated user data
    """
    
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'goal_wake_time', 'wake_up_duration', 'sleep_sensitivity']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Validate goal_wake_time format
        wake_time = data['goal_wake_time']
        try:
            hours, minutes = wake_time.split(':')
            int(hours)
            int(minutes)
        except:
            return jsonify({
                'error': 'goal_wake_time must be in HH:MM format'
            }), 400
        
        # Create or update user
        user_id = data.get('user_id')
        
        if user_id:
            # Update existing user
            updates = {
                'goal_wake_time': data['goal_wake_time'],
                'wake_up_duration': data['wake_up_duration'],
                'sleep_sensitivity': data.get('sleep_sensitivity', 'medium'),
                'preferred_sounds': data.get('preferred_sounds', [])
            }
            user = db.update_user(user_id, updates)
            
            return jsonify({
                'success': True,
                'message': 'User preferences updated successfully',
                'user': user
            }), 200
        
        else:
            # Create new user
            user = db.create_user(
                email=data['email'],
                goal_wake_time=data['goal_wake_time'],
                wake_up_duration=data['wake_up_duration']
            )
            
            # Update with additional preferences if provided
            additional_updates = {}
            if 'sleep_sensitivity' in data:
                additional_updates['sleep_sensitivity'] = data['sleep_sensitivity']
            if 'preferred_sounds' in data:
                additional_updates['preferred_sounds'] = data['preferred_sounds']
            
            if additional_updates:
                user = db.update_user(user['id'], additional_updates)
            
            return jsonify({
                'success': True,
                'message': 'User created successfully',
                'user': user
            }), 201
    
    except Exception as e:
        return jsonify({
            'error': 'Failed to process quiz submission',
            'details': str(e)
        }), 500
