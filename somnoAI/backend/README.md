# SonmoAI Flask Backend

Smart Adaptive Alarm System with Gemini AI Integration

## Overview

This Flask backend powers the SonmoAI mobile app by managing user preferences, generating AI-optimized alarm configurations, and collecting feedback to continuously improve wake-up experiences.

## Features

- **AI-Powered Alarm Generation**: Uses Google's Gemini API to create optimal alarm configurations
- **Feedback Loop**: Collects user happiness ratings and adapts alarms for better performance
- **Supabase Integration**: Stores users, alarm profiles, and feedback in Supabase
- **RESTful API**: Clean endpoints for mobile app integration

## Setup

### 1. Install Dependencies

```bash
cd somnoAI/backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `somnoAI/backend` directory:

```env
SECRET_KEY=your-secret-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
GEMINI_API_KEY=AIzaSyCiVDwhkxZvDBWTf3Ancoo6o_ZK6w_JbIQ
```

### 3. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Quiz (Onboarding)

**POST** `/api/quiz`
- Submit user preferences from onboarding quiz
- Creates/updates user profile in Supabase

### Alarm

**POST** `/api/alarm/generate`
- Generate AI-optimized alarm configuration
- Uses Gemini API to analyze user data and feedback

**GET** `/api/alarm/current?user_id=xxx`
- Get the current scheduled alarm for a user

**POST** `/api/alarm/feedback`
- Submit feedback after waking up
- Feeds back into AI for next optimization

**GET** `/api/alarm/history?user_id=xxx&limit=50`
- Get alarm history for analytics

## Database Schema

### users
- `id` (UUID)
- `email` (text)
- `goal_wake_time` (time)
- `wake_up_duration` (integer)
- `sleep_sensitivity` (text)

### alarm_profiles
- `id` (UUID)
- `user_id` (UUID)
- `wake_time` (time)
- `sound` (text)
- `volume_ramp` (integer)
- `duration` (integer)
- `pattern` (text)
- `created_at` (timestamp)

### feedback
- `id` (UUID)
- `alarm_profile_id` (UUID)
- `user_id` (UUID)
- `happiness_rating` (integer 1-5)
- `alarm_effectiveness` (text)
- `woke_up_late` (boolean)
- `created_at` (timestamp)

## AI Integration

The backend uses Gemini API to optimize alarm configurations based on:
1. User's goal wake time
2. Sleep sensitivity level
3. Past feedback (happiness ratings, effectiveness)
4. Previous alarm performance

The AI aims to maximize user happiness (5/5 rating) while ensuring they never wake up late.

## Development

- Run in debug mode: `python app.py`
- Uses mock responses when Supabase isn't configured
- CORS enabled for local development

## Testing

```bash
# Health check
curl http://localhost:5001/

# Generate alarm
curl -X POST http://localhost:5001/api/alarm/generate \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test-user-123"}'
```
