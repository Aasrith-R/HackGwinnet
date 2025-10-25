# SomnoAI - AI-Powered Sleep Assistant

A React Native + Expo mobile app that helps users fall asleep faster and wake up calmer using AI-powered soundscapes, personalized recommendations, and sleep tracking.

## 🌙 Features

### Core Features
- **AI-Personalized Sleep Sound Mixer** - Mood-based sound profiles with customizable intensity
- **Smart Alarm + AI Morning Brief** - Weather-aware wake-up experience with personalized messages
- **AI Sleep Journal + Insights** - Track sleep patterns and get AI-generated recommendations
- **Mood-Based Personalization** - Dynamic UI and sound selection based on current mood
- **Sleep Routine Recommender** - Daily AI tips based on sleep data analysis

### Technical Features
- Clean, modular React Native code with Expo SDK 51+
- React Navigation for seamless screen transitions
- AsyncStorage for local data persistence
- Mock AI functions for reliable demo experience
- Beautiful UI with gradients and smooth animations
- Chart visualization for sleep data trends

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd /Users/ryvaandas/HackGwinnet
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

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

### Utils
- **aiMock.js** - Mock AI functions for sound profiles, insights, and recommendations
- **storage.js** - AsyncStorage utilities for data persistence

## 🧠 AI Features (Mocked)

### Sound Profile Generation
```javascript
// Example: Anxious mood generates rain + brown noise
generateSoundProfile('Anxious') 
// Returns: { sounds: ['rain', 'brownNoise'], intensities: [0.8, 0.6] }
```

### Morning Brief Generation
```javascript
// Combines sleep data, weather, and motivational messages
generateMorningBrief(sleepData, weatherData, mood)
// Returns: "Good morning! You slept well last night — start your day strong!"
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

## 🔧 Customization

### Adding Real AI Integration
Replace mock functions in `src/utils/aiMock.js` with actual API calls:
- OpenAI GPT for text generation
- ElevenLabs for text-to-speech
- Weather API for real weather data
- Custom ML models for sleep analysis

### Adding Real Audio Files
1. Add MP3 files to `assets/sounds/` directory
2. Update `SoundMixer.js` to load actual audio files
3. Implement proper audio mixing with expo-av

### Extending Features
- Add more mood options
- Implement sleep stage detection
- Add social features for sleep challenges
- Integrate with wearable devices

## 🐛 Troubleshooting

### Common Issues
1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **Dependency conflicts**: Delete `node_modules` and reinstall
3. **iOS simulator not starting**: Check Xcode installation
4. **Android emulator issues**: Verify Android Studio setup

### Development Tips
- Use `console.log` for debugging in Expo Go
- Check Metro bundler logs for build errors
- Test on both iOS and Android for compatibility

## 📈 Future Enhancements

- Real-time sleep monitoring
- Integration with health apps
- Advanced sleep analytics
- Social sleep challenges
- Wearable device support
- Voice commands
- Smart home integration

## 🤝 Contributing

This is a demo project for a hackathon. For production use:
1. Add proper error handling
2. Implement real AI integrations
3. Add comprehensive testing
4. Optimize performance
5. Add accessibility features

## 📄 License

This project is created for educational and demo purposes. Feel free to use and modify for your own projects.

---

**SomnoAI** - Your personal AI sleep companion for better rest and peaceful mornings. 🌙✨
