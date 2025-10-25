"""
Supabase Service
Handles all database operations for users, alarms, and feedback.
"""

from supabase import create_client, Client
from config import Config
from typing import Dict, List, Optional, Any
import json
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class SupabaseService:
    """
    Service class for interacting with Supabase database.
    Handles CRUD operations for users, alarm profiles, and feedback.
    """
    
    def __init__(self):
        """Initialize Supabase client with credentials from config."""
        # Use placeholder values if not configured (for development)
        supabase_url = Config.SUPABASE_URL if Config.SUPABASE_URL != 'https://your-project.supabase.co' else 'https://placeholder.supabase.co'
        supabase_key = Config.SUPABASE_KEY if Config.SUPABASE_KEY != 'your-anon-key' else 'placeholder-key'
        
        try:
            self.client: Client = create_client(supabase_url, supabase_key)
            self.mode = 'production' if supabase_url != 'https://placeholder.supabase.co' else 'development'
        except Exception as e:
            print(f"Warning: Supabase not configured properly: {e}")
            print("Running in development mode with mock data")
            self.client = None
            self.mode = 'development'
        
        # File-based storage for development mode
        import os
        self._dev_feedback_file = os.path.join(os.path.dirname(__file__), '..', 'dev_feedback.json')
        self._dev_feedback = self._load_dev_feedback()
    
    # Development storage methods
    
    def _load_dev_feedback(self) -> List[Dict[str, Any]]:
        """Load feedback from file for development mode."""
        import json
        import os
        try:
            print(f"DEBUG: Looking for feedback file at: {self._dev_feedback_file}")
            if os.path.exists(self._dev_feedback_file):
                with open(self._dev_feedback_file, 'r') as f:
                    feedback = json.load(f)
                    print(f"DEBUG: Loaded {len(feedback)} feedback entries from file")
                    return feedback
            else:
                print("DEBUG: Feedback file does not exist")
        except Exception as e:
            print(f"Error loading dev feedback: {e}")
        return []
    
    def _save_dev_feedback(self):
        """Save feedback to file for development mode."""
        import json
        try:
            with open(self._dev_feedback_file, 'w') as f:
                json.dump(self._dev_feedback, f)
        except Exception as e:
            print(f"Error saving dev feedback: {e}")
    
    def clear_all_feedback(self):
        """Clear all feedback data for development mode."""
        if self.mode == 'development' or not self.client:
            self._dev_feedback = []
            self._save_dev_feedback()
            print("DEBUG: Cleared all feedback data")
            return True
        else:
            # In production, you might want to clear the database
            # For now, just return True
            return True
    
    # User Operations
    
    def _get_mock_user(self, user_id: str = None) -> Dict[str, Any]:
        """Return mock user data for development."""
        return {
            'id': user_id or 'dev-user-123',
            'email': 'dev@example.com',
            'goal_wake_time': '07:00',
            'wake_up_duration': 15,
            'sleep_sensitivity': 'medium'
        }
    
    def create_user(self, email: str, goal_wake_time: str, wake_up_duration: int) -> Dict[str, Any]:
        """
        Create a new user in the database.
        
        Args:
            email: User's email address
            goal_wake_time: Desired wake-up time (HH:MM format)
            wake_up_duration: Duration in minutes for gradual wake-up
            
        Returns:
            Dictionary containing created user data
        """
        if self.mode == 'development' or not self.client:
            return {
                'id': 'dev-user-123',
                'email': email,
                'goal_wake_time': goal_wake_time,
                'wake_up_duration': wake_up_duration
            }
        
        try:
            result = self.client.table('users').insert({
                'email': email,
                'goal_wake_time': goal_wake_time,
                'wake_up_duration': wake_up_duration
            }).execute()
            
            return result.data[0] if result.data else {}
        except Exception as e:
            print(f"Error creating user: {str(e)}")
            raise
    
    def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve user by ID.
        
        Args:
            user_id: User's unique identifier
            
        Returns:
            User data dictionary or None
        """
        if self.mode == 'development' or not self.client:
            return self._get_mock_user(user_id)
        
        try:
            result = self.client.table('users').select('*').eq('id', user_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error getting user: {str(e)}")
            return None
    
    def update_user(self, user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update user information.
        
        Args:
            user_id: User's unique identifier
            updates: Dictionary of fields to update
            
        Returns:
            Updated user data
        """
        if self.mode == 'development' or not self.client:
            # In development mode, just return the mock user with updates
            mock_user = self._get_mock_user(user_id)
            mock_user.update(updates)
            return mock_user
        
        try:
            result = self.client.table('users').update(updates).eq('id', user_id).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            print(f"Error updating user: {str(e)}")
            raise
    
    # Alarm Profile Operations
    
    def create_alarm_profile(
        self, 
        user_id: str, 
        wake_time: str, 
        sound: str, 
        volume_ramp: int, 
        duration: int, 
        pattern: str
    ) -> Dict[str, Any]:
        """
        Create a new alarm profile for a user.
        
        Args:
            user_id: User's unique identifier
            wake_time: Alarm wake time (HH:MM format)
            sound: Alarm sound type
            volume_ramp: Duration for volume ramp-up (minutes)
            duration: Total alarm duration (minutes)
            pattern: Alarm pattern description
            
        Returns:
            Created alarm profile data
        """
        import time
        
        if self.mode == 'development' or not self.client:
            return {
                'id': f'alarm-{int(time.time())}',
                'user_id': user_id,
                'wake_time': wake_time,
                'sound': sound,
                'volume_ramp': volume_ramp,
                'duration': duration,
                'pattern': pattern,
                'created_at': time.time()
            }
        
        try:
            result = self.client.table('alarm_profiles').insert({
                'user_id': user_id,
                'wake_time': wake_time,
                'sound': sound,
                'volume_ramp': volume_ramp,
                'duration': duration,
                'pattern': pattern
            }).execute()
            
            return result.data[0] if result.data else {}
        except Exception as e:
            print(f"Error creating alarm profile: {str(e)}")
            raise
    
    def get_current_alarm(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get the most recent alarm profile for a user.
        
        Args:
            user_id: User's unique identifier
            
        Returns:
            Latest alarm profile or None
        """
        if self.mode == 'development' or not self.client:
            # Return None for development mode (no existing alarms)
            return None
        
        try:
            result = (
                self.client.table('alarm_profiles')
                .select('*')
                .eq('user_id', user_id)
                .order('created_at', desc=True)
                .limit(1)
                .execute()
            )
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error getting current alarm: {str(e)}")
            return None
    
    def get_alarm_history(self, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Get alarm history for a user.
        
        Args:
            user_id: User's unique identifier
            limit: Maximum number of records to return
            
        Returns:
            List of alarm profiles
        """
        if self.mode == 'development' or not self.client:
            # Return empty list for development mode
            return []
        
        try:
            result = (
                self.client.table('alarm_profiles')
                .select('*')
                .eq('user_id', user_id)
                .order('created_at', desc=True)
                .limit(limit)
                .execute()
            )
            return result.data if result.data else []
        except Exception as e:
            print(f"Error getting alarm history: {str(e)}")
            return []
    
    # Feedback Operations
    
    def create_feedback(
        self, 
        alarm_profile_id: str, 
        user_id: str, 
        happiness_rating: int, 
        alarm_effectiveness: str, 
        woke_up_late: bool
    ) -> Dict[str, Any]:
        """
        Create feedback for an alarm.
        
        Args:
            alarm_profile_id: Alarm profile identifier
            user_id: User's unique identifier
            happiness_rating: Happiness rating (1-5)
            alarm_effectiveness: Effectiveness rating (gentle/harsh/just_right)
            woke_up_late: Whether user woke up late
            
        Returns:
            Created feedback data
        """
        import time
        
        if self.mode == 'development' or not self.client:
            feedback_data = {
                'id': f'feedback-{int(time.time())}',
                'alarm_profile_id': alarm_profile_id,
                'user_id': user_id,
                'happiness_rating': happiness_rating,
                'alarm_effectiveness': alarm_effectiveness,
                'woke_up_late': woke_up_late,
                'created_at': time.time()
            }
            # Store in development memory and save to file
            self._dev_feedback.append(feedback_data)
            self._save_dev_feedback()
            return feedback_data
        
        try:
            result = self.client.table('feedback').insert({
                'alarm_profile_id': alarm_profile_id,
                'user_id': user_id,
                'happiness_rating': happiness_rating,
                'alarm_effectiveness': alarm_effectiveness,
                'woke_up_late': woke_up_late
            }).execute()
            
            return result.data[0] if result.data else {}
        except Exception as e:
            print(f"Error creating feedback: {str(e)}")
            raise
    
    def get_user_feedback(self, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Get feedback history for a user.
        
        Args:
            user_id: User's unique identifier
            limit: Maximum number of records to return
            
        Returns:
            List of feedback records
        """
        if self.mode == 'development' or not self.client:
            # Return stored feedback for development mode
            user_feedback = [f for f in self._dev_feedback if f.get('user_id') == user_id]
            # Sort by created_at descending and limit
            user_feedback.sort(key=lambda x: x.get('created_at', 0), reverse=True)
            print(f"DEBUG: Found {len(user_feedback)} feedback entries for user {user_id}")
            return user_feedback[:limit]
        
        try:
            result = (
                self.client.table('feedback')
                .select('*')
                .eq('user_id', user_id)
                .order('created_at', desc=True)
                .limit(limit)
                .execute()
            )
            return result.data if result.data else []
        except Exception as e:
            print(f"Error getting user feedback: {str(e)}")
            return []
