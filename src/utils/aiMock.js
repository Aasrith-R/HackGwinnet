/**
 * Mock AI Functions for SomnoAI
 * These simulate AI responses for demo purposes
 * In production, replace with actual API calls to OpenAI, ElevenLabs, etc.
 */

// Mock sleep sound profile generator
export function generateSoundProfile(mood) {
  const soundProfiles = {
    'Anxious': {
      sounds: ['rain', 'brownNoise'],
      intensities: [0.8, 0.6],
      description: 'Calming rain with deep brown noise to ease anxiety'
    },
    'Tired': {
      sounds: ['ocean', 'pinkNoise'],
      intensities: [0.7, 0.5],
      description: 'Gentle ocean waves with pink noise for deep relaxation'
    },
    'Peaceful': {
      sounds: ['fan', 'forest'],
      intensities: [0.6, 0.4],
      description: 'Soft fan with forest ambience for peaceful sleep'
    },
    'Stressed': {
      sounds: ['rain', 'whiteNoise'],
      intensities: [0.9, 0.3],
      description: 'Heavy rain with white noise to block out stress'
    },
    'Energetic': {
      sounds: ['birdsong', 'wind'],
      intensities: [0.4, 0.6],
      description: 'Gentle birdsong with wind for natural energy'
    }
  };

  return soundProfiles[mood] || {
    sounds: ['whiteNoise'],
    intensities: [0.5],
    description: 'Standard white noise for neutral sleep'
  };
}

// Mock AI morning brief generator
export function generateMorningBrief(sleepData, weatherData, mood) {
  const motivationalMessages = [
    "You've got this! Today is full of possibilities.",
    "Your sleep was restorative. Time to conquer the day!",
    "Every morning is a fresh start. Make it count!",
    "You're well-rested and ready to achieve great things.",
    "The day ahead is yours to shape. Start strong!"
  ];

  const weatherMessages = {
    'sunny': "The sun is shining bright today!",
    'cloudy': "It's a cozy, overcast day perfect for productivity.",
    'rainy': "The gentle rain creates a peaceful atmosphere.",
    'clear': "The sky is clear and full of potential."
  };

  const sleepQualityMessages = {
    5: "You had an excellent night's sleep!",
    4: "You slept well and should feel refreshed.",
    3: "Your sleep was decent, but there's room for improvement.",
    2: "Your sleep quality could be better tonight.",
    1: "Consider adjusting your bedtime routine for better rest."
  };

  const randomMotivation = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  const weatherMessage = weatherMessages[weatherData?.condition] || "The weather looks pleasant today.";
  const sleepMessage = sleepQualityMessages[sleepData?.quality] || "Your sleep patterns are being tracked.";

  return `${randomMotivation} ${sleepMessage} ${weatherMessage} Have a wonderful day!`;
}

// Mock sleep insights generator
export function generateSleepInsights(sleepLogs) {
  if (!sleepLogs || sleepLogs.length === 0) {
    return "Start logging your sleep to get personalized insights!";
  }

  const avgBedtime = sleepLogs.reduce((sum, log) => sum + log.bedtime, 0) / sleepLogs.length;
  const avgWakeTime = sleepLogs.reduce((sum, log) => sum + log.wakeTime, 0) / sleepLogs.length;
  const avgQuality = sleepLogs.reduce((sum, log) => sum + log.quality, 0) / sleepLogs.length;

  const insights = [];

  if (avgBedtime > 23) {
    insights.push("Try going to bed 30 minutes earlier for better sleep quality.");
  }

  if (avgQuality < 3) {
    insights.push("Consider avoiding screens 30 minutes before bedtime.");
  }

  if (avgWakeTime - avgBedtime < 7) {
    insights.push("Aim for 7-8 hours of sleep for optimal rest.");
  }

  if (insights.length === 0) {
    insights.push("Great job maintaining a consistent sleep schedule!");
  }

  return insights.join(" ");
}

// Mock daily recommendation generator
export function generateDailyRecommendation(sleepLogs, currentMood) {
  const recommendations = {
    'Anxious': [
      "Try a 10-minute meditation before bed.",
      "Consider using the 'Peaceful' sound profile tonight.",
      "Avoid caffeine after 2 PM to reduce anxiety."
    ],
    'Tired': [
      "You might benefit from an earlier bedtime tonight.",
      "Try the 'Ocean' sound profile for deep relaxation.",
      "Consider a short nap if you're feeling exhausted."
    ],
    'Peaceful': [
      "Your calm mood is perfect for quality sleep.",
      "Continue with your current routine - it's working well!",
      "Try the 'Forest' sound profile for natural ambience."
    ],
    'Stressed': [
      "Take 5 deep breaths before starting your sleep routine.",
      "Use the 'Rain' sound profile to help you unwind.",
      "Write down your thoughts in a journal to clear your mind."
    ]
  };

  const moodRecommendations = recommendations[currentMood] || [
    "Maintain your current sleep routine for consistency.",
    "Try experimenting with different sound profiles.",
    "Keep tracking your sleep for better insights."
  ];

  return moodRecommendations[Math.floor(Math.random() * moodRecommendations.length)];
}

// Mock weather data generator
export function generateMockWeather() {
  const conditions = ['sunny', 'cloudy', 'rainy', 'clear'];
  const temperatures = [65, 68, 72, 75, 78, 82];
  
  return {
    temperature: temperatures[Math.floor(Math.random() * temperatures.length)],
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    humidity: Math.floor(Math.random() * 40) + 40,
    description: "Perfect weather for a good night's sleep"
  };
}
