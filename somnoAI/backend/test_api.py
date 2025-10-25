"""
Test script for SonmoAI Flask Backend
Quick tests to verify all endpoints are working.
"""

import requests
import json

BASE_URL = "http://localhost:5001"

def test_health_check():
    """Test the health check endpoint."""
    print("Testing health check...")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_generate_alarm():
    """Test alarm generation (will use mock data)."""
    print("Testing alarm generation...")
    response = requests.post(
        f"{BASE_URL}/api/alarm/generate",
        json={"user_id": "test-user-123"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

if __name__ == "__main__":
    print("=" * 50)
    print("SonmoAI Backend API Tests")
    print("=" * 50)
    print()
    
    test_health_check()
    test_generate_alarm()
    
    print("Tests completed!")
