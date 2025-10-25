# Network Workarounds for SonmoAI

## Problem
Supabase network access is blocked, preventing normal database operations.

## Solutions Implemented

### 1. Mock Supabase Client
- **File**: `lib/supabase.ts`
- **What it does**: Replaces Supabase with local AsyncStorage
- **How to use**: Automatically activated when `isNetworkBlocked = true`

### 2. Local Storage Service
- **File**: `lib/localStorage.ts`
- **What it does**: Provides full database functionality using AsyncStorage
- **Features**:
  - User management
  - Alarm profile storage
  - Feedback collection
  - Data persistence across app restarts

### 3. Backend Service Fallback
- **File**: `lib/backendService.ts`
- **What it does**: Falls back to local storage when Flask backend is unavailable
- **Features**:
  - Mock alarm generation
  - Local data storage
  - Seamless fallback

### 4. Development Tools
- **File**: `components/DevTools.tsx`
- **Location**: Settings tab (development mode only)
- **Features**:
  - View all local data
  - Create mock users and alarms
  - Clear all data
  - Debug data structure

## How to Test Without Network

### 1. Start the App
```bash
cd somnoAI
npx expo start
```

### 2. Use the Bypass Button
- Go to the signin screen
- Click the red "Dev Bypass" button
- This creates a mock user automatically

### 3. Test the Wake Tab
- Navigate to the Wake tab
- Click "Generate New Alarm" to create mock alarms
- Submit feedback to test the feedback system

### 4. Use Development Tools
- Go to Settings tab
- Scroll down to "Development Tools"
- Use the tools to:
  - Create mock data
  - View stored data
  - Clear data for testing

## Mock Data Generated

### Users
- ID: `dev-user-123`
- Email: `dev@example.com`
- Goal wake time: `07:00`
- Wake duration: `15 minutes`

### Alarms
- Sound: `nature`
- Volume ramp: `5 minutes`
- Duration: `15 minutes`
- Pattern: Gentle nature sounds with gradual volume increase

### Feedback
- Happiness rating: 1-5 scale
- Effectiveness: gentle/harsh/just_right
- Late wake-up tracking

## Data Persistence

All data is stored locally using AsyncStorage and persists across:
- App restarts
- Device reboots
- Development sessions

## Switching Back to Network

When network access is restored:

1. Set `isNetworkBlocked = false` in `lib/supabase.ts`
2. Configure proper Supabase credentials
3. Data will sync with the backend

## Benefits of This Approach

- ✅ Full functionality without network
- ✅ Realistic data structures
- ✅ Easy testing and debugging
- ✅ Seamless transition to network mode
- ✅ No external dependencies
