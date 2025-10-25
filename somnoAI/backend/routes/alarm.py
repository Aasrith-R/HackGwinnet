"""
Alarm Routes
Handles alarm configuration generation, retrieval, and feedback collection.
"""

from flask import Blueprint, request, jsonify
from services.supabase_service import SupabaseService
from services.gemini_service import GeminiService

alarm_bp = Blueprint('alarm', __name__)
db = SupabaseService()
ai_service = GeminiService()

@alarm_bp.route('/generate', methods=['POST'])
def generate_alarm():
    """
    Generate a new alarm configuration using AI.
    
    Uses Gemini API to create an optimized alarm configuration based on:
    - User profile (wake time, sensitivity, preferences)
    - Past alarm performance metrics
    - Feedback history
    
    Expected JSON body:
    {
        "user_id": "string (required)"
    }
    
    Returns:
        JSON response with generated alarm configuration
    """
    
    try:
        data = request.get_json()
        
        # Validate user_id
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({
                'error': 'user_id is required'
            }), 400
        
        # Get requested wake time
        requested_wake_time = data.get('wake_time')
        
        # Get user profile
        user = db.get_user(user_id)
        if not user:
            return jsonify({
                'error': 'User not found'
            }), 404
        
        # Get past feedback for optimization
        past_feedback = db.get_user_feedback(user_id, limit=10)
        print(f"DEBUG: Retrieved {len(past_feedback)} feedback entries for user {user_id}")
        if past_feedback:
            print(f"DEBUG: Recent feedback: {past_feedback[0] if past_feedback else 'None'}")
        
        # Update user's goal wake time if provided
        if requested_wake_time:
            user['goal_wake_time'] = requested_wake_time
            db.update_user(user_id, {'goal_wake_time': requested_wake_time})
        
        # Build user profile for AI
        user_profile = {
            'goal_wake_time': requested_wake_time or user.get('goal_wake_time', '07:00'),
            'wake_up_duration': user.get('wake_up_duration', 15),
            'sleep_sensitivity': user.get('sleep_sensitivity', 'medium')
        }
        
        # Generate alarm configuration using AI
        ai_config = ai_service.generate_alarm_config(
            user_profile=user_profile,
            past_feedback=past_feedback,
            requested_wake_time=requested_wake_time
        )
        
        # Save alarm configuration to database
        alarm_profile = db.create_alarm_profile(
            user_id=user_id,
            wake_time=ai_config['wake_time'],
            sound=ai_config['sound'],
            volume_ramp=ai_config['volume_ramp'],
            duration=ai_config['duration'],
            pattern=ai_config['pattern']
        )
        
        return jsonify({
            'success': True,
            'alarm': {
                **alarm_profile,
                'reasoning': ai_config.get('reasoning', 'AI-generated optimal configuration')
            }
        }), 201
    
    except Exception as e:
        return jsonify({
            'error': 'Failed to generate alarm configuration',
            'details': str(e)
        }), 500

@alarm_bp.route('/current', methods=['GET'])
def get_current_alarm():
    """
    Get the current/next scheduled alarm for a user.
    
    Query parameters:
        user_id (required): User's unique identifier
    
    Returns:
        JSON response with current alarm configuration
    """
    
    try:
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({
                'error': 'user_id query parameter is required'
            }), 400
        
        # Get current alarm
        alarm = db.get_current_alarm(user_id)
        
        if not alarm:
            return jsonify({
                'success': False,
                'message': 'No alarm configured for this user',
                'alarm': None
            }), 200
        
        return jsonify({
            'success': True,
            'alarm': alarm
        }), 200
    
    except Exception as e:
        return jsonify({
            'error': 'Failed to retrieve current alarm',
            'details': str(e)
        }), 500

@alarm_bp.route('/feedback', methods=['POST'])
def submit_feedback():
    """
    Submit feedback for an alarm.
    
    Collects user feedback after waking up to optimize future alarms.
    This data is used by the AI to improve alarm configurations.
    
    Expected JSON body:
    {
        "alarm_profile_id": "string (required)",
        "user_id": "string (required)",
        "happiness_rating": integer (1-5, required),
        "alarm_effectiveness": "gentle/harsh/just_right (required)",
        "woke_up_late": boolean (required)
    }
    
    Returns:
        JSON response confirming feedback submission
    """
    
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['alarm_profile_id', 'user_id', 'happiness_rating', 
                          'alarm_effectiveness', 'woke_up_late']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Validate happiness_rating range
        happiness = data['happiness_rating']
        if not isinstance(happiness, int) or happiness < 1 or happiness > 5:
            return jsonify({
                'error': 'happiness_rating must be an integer between 1 and 5'
            }), 400
        
        # Validate alarm_effectiveness
        effectiveness = data['alarm_effectiveness']
        if effectiveness not in ['gentle', 'harsh', 'just_right']:
            return jsonify({
                'error': 'alarm_effectiveness must be one of: gentle, harsh, just_right'
            }), 400
        
        # Create feedback record
        feedback = db.create_feedback(
            alarm_profile_id=data['alarm_profile_id'],
            user_id=data['user_id'],
            happiness_rating=data['happiness_rating'],
            alarm_effectiveness=data['alarm_effectiveness'],
            woke_up_late=data['woke_up_late']
        )
        
        return jsonify({
            'success': True,
            'message': 'Feedback submitted successfully',
            'feedback': feedback
        }), 201
    
    except Exception as e:
        return jsonify({
            'error': 'Failed to submit feedback',
            'details': str(e)
        }), 500

@alarm_bp.route('/history', methods=['GET'])
def get_alarm_history():
    """
    Get alarm history for a user.
    
    Query parameters:
        user_id (required): User's unique identifier
        limit (optional): Maximum number of records to return (default: 50)
    
    Returns:
        JSON response with alarm history
    """
    
    try:
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({
                'error': 'user_id query parameter is required'
            }), 400
        
        limit = int(request.args.get('limit', 50))
        
        # Get alarm history
        history = db.get_alarm_history(user_id, limit=limit)
        
        return jsonify({
            'success': True,
            'count': len(history),
            'alarms': history
        }), 200
    
    except Exception as e:
        return jsonify({
            'error': 'Failed to retrieve alarm history',
            'details': str(e)
        }), 500

@alarm_bp.route('/clear-feedback', methods=['POST'])
def clear_feedback():
    """
    Clear all feedback data for development/testing.
    
    Returns:
        JSON response confirming feedback clearing
    """
    try:
        # Clear feedback data
        db.clear_all_feedback()
        return jsonify({
            'message': 'All feedback data cleared successfully'
        }), 200
    except Exception as e:
        print(f"Error clearing feedback: {e}")
        return jsonify({
            'error': 'Failed to clear feedback data',
            'details': str(e)
        }), 500
