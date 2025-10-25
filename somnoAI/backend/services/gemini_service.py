"""
Gemini AI Service
Handles AI-powered alarm configuration generation using Google's Gemini API.
"""

import requests
import json
from typing import Dict, List, Any, Optional
from config import Config

class GeminiService:
    """
    Service class for interacting with Google Gemini API.
    Generates optimized alarm configurations based on user data and feedback.
    """
    
    def __init__(self):
        """Initialize Gemini service with API key from config."""
        self.api_key = Config.GEMINI_API_KEY
        self.base_url = Config.GEMINI_API_URL
    
    def generate_alarm_config(
        self, 
        user_profile: Dict[str, Any], 
        past_feedback: List[Dict[str, Any]] = None,
        requested_wake_time: str = None
    ) -> Dict[str, Any]:
        """
        Generate an optimized alarm configuration using Gemini AI.
        
        This method analyzes user preferences and past feedback to create
        an alarm configuration that maximizes happiness without compromising
        the goal wake-up time.
        
        Args:
            user_profile: User data including wake time preferences
            past_feedback: Previous alarm feedback data for optimization
            
        Returns:
            Dictionary containing alarm configuration
        """
        
        # Build the prompt for the AI
        prompt = self._build_prompt(user_profile, past_feedback or [], requested_wake_time)
        
        try:
            # Call Gemini API
            response = self._call_gemini_api(prompt, user_profile, past_feedback)
            
            # Parse AI response
            alarm_config = self._parse_ai_response(response)
            
            return alarm_config
            
        except Exception as e:
            print(f"Error generating alarm config with Gemini: {str(e)}")
            # Fallback to default configuration
            return self._get_default_config(user_profile)
    
    def _build_prompt(self, user_profile: Dict, past_feedback: List[Dict], requested_wake_time: str = None) -> str:
        """
        Build the prompt for the Gemini API based on user data and feedback.
        
        Args:
            user_profile: User preferences and settings
            past_feedback: Historical feedback data
            
        Returns:
            Formatted prompt string for the AI
        """
        
        feedback_summary = ""
        if past_feedback:
            feedback_summary = self._summarize_feedback(past_feedback)
        
        # Use requested wake time if provided, otherwise use user profile
        wake_time = requested_wake_time or user_profile.get('goal_wake_time', '07:00')
        
        prompt = f"""
You are an AI assistant helping optimize alarm settings for a user to maximize their happiness 
while ensuring they wake up on time.

USER PROFILE:
- Goal Wake Time: {wake_time}
- Wake Up Duration: {user_profile.get('wake_up_duration', 15)} minutes
- Sleep Sensitivity: {user_profile.get('sleep_sensitivity', 'medium')}

{past_feedback and 'PAST FEEDBACK:' or ''}
{feedback_summary}

OPTIMIZATION STRATEGY:
Based on past feedback, create a NEW alarm configuration that learns from previous attempts:
- If previous alarms were "too gentle", make this one slightly more intense
- If previous alarms were "too harsh", make this one more gentle
- If previous alarms were "just right", try a similar but slightly varied approach
- Always aim to improve happiness rating while maintaining wake-up effectiveness

TASK:
Generate an optimal alarm configuration that:
1. Helps the user wake up at their goal time (never late)
2. Maximizes their happiness rating (aim for 5/5)
3. Adapts based on past feedback patterns

RESPOND WITH ONLY VALID JSON in this exact format:
{{
    "wake_time": "HH:MM",
    "sound": "nature/nature_rain/nature_birds/white_noise/soft_melody",
    "volume_ramp": 5,
    "duration": 20,
    "pattern": "description of the alarm pattern (e.g., 'Soft start, gradual volume increase, gentle crescendo')",
    "reasoning": "Brief explanation of why this configuration was chosen"
}}

Guidelines:
- Sound options: nature, nature_rain, nature_birds, white_noise, soft_melody
- volume_ramp: 3-10 minutes for gradual wake-up
- duration: 15-30 minutes total alarm duration
- Adjust based on feedback: if too gentle, increase intensity; if woke up late, start earlier
"""
        
        return prompt
    
    def _summarize_feedback(self, feedback_list: List[Dict]) -> str:
        """
        Summarize past feedback for the AI prompt.
        
        Args:
            feedback_list: List of feedback records
            
        Returns:
            Formatted feedback summary
        """
        if not feedback_list:
            return "No past feedback available."
        
        avg_happiness = sum(f.get('happiness_rating', 0) for f in feedback_list) / len(feedback_list)
        late_count = sum(1 for f in feedback_list if f.get('woke_up_late', False))
        effectiveness_counts = {}
        
        for f in feedback_list:
            eff = f.get('alarm_effectiveness', 'unknown')
            effectiveness_counts[eff] = effectiveness_counts.get(eff, 0) + 1
        
        summary = f"""
- Average Happiness Rating: {avg_happiness:.1f}/5
- Times Woke Up Late: {late_count}/{len(feedback_list)}
- Alarm Effectiveness: {effectiveness_counts}

Recent Feedback:
"""
        for i, f in enumerate(feedback_list[:5], 1):
            summary += f"{i}. Happiness: {f.get('happiness_rating')}/5, Effectiveness: {f.get('alarm_effectiveness')}, Late: {f.get('woke_up_late')}\n"
        
        return summary
    
    def _call_gemini_api(self, prompt: str, user_profile: Dict = None, past_feedback: List[Dict] = None) -> str:
        """
        Call the Gemini API with the prompt.
        
        Args:
            prompt: The prompt to send to the AI
            
        Returns:
            AI response text
        """
        
        # For development, return mock response
        if Config.SUPABASE_URL == 'https://your-project.supabase.co':
            wake_time = user_profile.get('goal_wake_time', '07:00') if user_profile else '07:00'
            return self._get_mock_response(wake_time, past_feedback or [])
        
        try:
            url = f"{self.base_url}?key={self.api_key}"
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": prompt
                    }]
                }]
            }
            
            response = requests.post(url, json=payload, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            # Extract text from Gemini response
            if 'candidates' in data and len(data['candidates']) > 0:
                content = data['candidates'][0].get('content', {})
                parts = content.get('parts', [])
                if parts:
                    return parts[0].get('text', '')
            
            return ""
            
        except requests.exceptions.RequestException as e:
            print(f"Gemini API request failed: {str(e)}")
            return ""
    
    def _parse_ai_response(self, response_text: str) -> Dict[str, Any]:
        """
        Parse the AI response and extract alarm configuration.
        
        Args:
            response_text: Raw response from Gemini API
            
        Returns:
            Parsed alarm configuration dictionary
        """
        
        try:
            # Try to extract JSON from the response
            # The AI response might have additional text, so we extract just the JSON
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            
            if json_start != -1 and json_end > json_start:
                json_str = response_text[json_start:json_end]
                config = json.loads(json_str)
                return config
            else:
                raise ValueError("No JSON found in response")
                
        except (json.JSONDecodeError, ValueError) as e:
            print(f"Error parsing AI response: {str(e)}")
            print(f"Response was: {response_text}")
            return self._get_default_config({})
    
    def _get_default_config(self, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a default alarm configuration as fallback.
        
        Args:
            user_profile: User preference data
            
        Returns:
            Default alarm configuration
        """
        return {
            "wake_time": user_profile.get('goal_wake_time', '07:00'),
            "sound": "nature",
            "volume_ramp": Config.DEFAULT_VOLUME_RAMP,
            "duration": user_profile.get('wake_up_duration', Config.DEFAULT_WAKE_UP_DURATION),
            "pattern": "Soft start with nature sounds, gradual volume increase over 5 minutes",
            "reasoning": "Default configuration for first-time setup"
        }
    
    def _get_mock_response(self, wake_time: str = "07:00", past_feedback: List[Dict] = None) -> str:
        """
        Return a mock AI response for development/testing that learns from feedback.
        
        Args:
            wake_time: The requested wake time to use in the mock response
            past_feedback: List of past feedback to learn from
            
        Returns:
            Mock JSON response string
        """
        # Analyze past feedback to determine optimization
        sound = "nature"
        volume_ramp = 5
        duration = 15
        reasoning = f"Mock response for development - uses gentle nature sounds for a pleasant wake-up experience at {wake_time}"
        
        if past_feedback and len(past_feedback) > 0:
            # Analyze recent feedback
            recent_feedback = past_feedback[-3:]  # Last 3 feedback entries
            
            # Count feedback types
            gentle_count = sum(1 for f in recent_feedback if f.get('alarm_effectiveness') == 'gentle')
            harsh_count = sum(1 for f in recent_feedback if f.get('alarm_effectiveness') == 'harsh')
            just_right_count = sum(1 for f in recent_feedback if f.get('alarm_effectiveness') == 'just_right')
            
            avg_happiness = sum(f.get('happiness_rating', 3) for f in recent_feedback) / len(recent_feedback)
            
            # Optimize based on feedback
            if gentle_count > harsh_count and avg_happiness < 4:
                # Previous alarms were too gentle, make this one more intense
                sound = "energetic"
                volume_ramp = 3
                duration = 20
                reasoning = f"Based on feedback: Previous alarms were too gentle (happiness: {avg_happiness:.1f}/5). Using more energetic sounds with faster ramp-up for {wake_time}."
            elif harsh_count > gentle_count and avg_happiness < 4:
                # Previous alarms were too harsh, make this one gentler
                sound = "melodic"
                volume_ramp = 8
                duration = 12
                reasoning = f"Based on feedback: Previous alarms were too harsh (happiness: {avg_happiness:.1f}/5). Using gentler melodic sounds with slower ramp-up for {wake_time}."
            elif just_right_count > 0 and avg_happiness >= 4:
                # Previous alarms were good, try a slight variation
                sound = "nature_rain"
                volume_ramp = 6
                duration = 18
                reasoning = f"Based on feedback: Previous alarms worked well (happiness: {avg_happiness:.1f}/5). Trying a slight variation with nature rain sounds for {wake_time}."
            else:
                # Mixed feedback, try a balanced approach
                sound = "soft_melody"
                volume_ramp = 5
                duration = 15
                reasoning = f"Based on mixed feedback (happiness: {avg_happiness:.1f}/5). Using balanced soft melody approach for {wake_time}."
        
        return json.dumps({
            "wake_time": wake_time,
            "sound": sound,
            "volume_ramp": volume_ramp,
            "duration": duration,
            "pattern": f"{sound.replace('_', ' ').title()} sounds starting soft, gradually increasing over {volume_ramp} minutes, followed by sustained wake-up sounds for {duration} minutes total",
            "reasoning": reasoning
        })
