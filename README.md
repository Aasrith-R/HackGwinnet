# SomnoAI - AI-Powered Sleep Assistant

A React Native + Expo mobile app that helps users fall asleep faster and wake up calmer using AI-powered soundscapes, personalized recommendations, and sleep tracking.

## 🌙 Features

### Core Features
- **AI-Personalized Sleep Sound Mixer** - Mood-based sound profiles with customizable intensity
- **Smart Alarm** - Wake-up experience with personalized messages
- **AI Sleep Journal + Insights** - Track sleep patterns and get AI-generated recommendations
- **Sleep Routine Recommender** - Daily AI tips based on sleep data analysis

### Technical Features
- Clean, modular React Native code with Expo SDK 51+
- React Navigation for seamless screen transitions
- AsyncStorage for local data persistence
- AI functions for reliable demo experience
- Beautiful UI with gradients and smooth animations
- Chart visualization for sleep data trends

## 📱 App Structure

### Screens
- **HomeScreen** - Central hub with navigation and AI recommendations
- **SleepScreen** - AI sound mixer with mood selection and sleep controls
- **WakeScreen** - Morning brief with weather and gentle alarm
- **JournalScreen** - Sleep tracking with charts and AI insights
- **SettingsScreen** - User preferences and app configuration

### Components
- **MoodSelector** - Dropdown for selecting current mood
- **SoundMixer** - Audio playback controls with AI-generated profiles
- **WeatherCard** - Weather display with mock data
- **InsightCard** - AI-generated insights and recommendations
- **SleepJournal** - Sleep data input and visualization

## 🧠 AI Features

### Sound Profile Generation
```javascript
// Example: Anxious mood generates rain + brown noise
generateSoundProfile('Anxious') 
// Returns: { sounds: ['rain', 'brownNoise'], intensities: [0.8, 0.6] }
```

### Sleep Insights
```javascript
// Analyzes sleep patterns and provides recommendations
generateSleepInsights(sleepLogs)
// Returns: "Try going to bed 30 minutes earlier for better sleep quality."
```

## 🎨 UI/UX Features

- **Mood-based theming** - Colors and gradients change based on selected mood
- **Smooth animations** - LinearGradient backgrounds and transitions
- **Intuitive navigation** - Bottom tab navigation with clear icons
- **Responsive design** - Adapts to different screen sizes
- **Accessibility** - Clear labels and touch targets

## 📊 Data Storage

The app uses AsyncStorage to persist:
- Sleep logs with bedtime, wake time, and quality ratings
- User preferences (mood, volume, alarm time)
- Current mood selection
- Sleep session data

### Extending Features
- Add more mood options
- Implement sleep stage detection
- Add social features for sleep challenges
- Integrate with wearable devices

## 📈 Future Enhancements

- Real-time sleep monitoring
- Integration with health apps
- Advanced sleep analytics
- Social sleep challenges
- Wearable device support
- Voice commands
- Smart home integration

---

**SomnoAI** - Your personal AI sleep companion for better rest and peaceful mornings. 🌙✨
