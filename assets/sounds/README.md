# Sound Files

This directory should contain the following audio files for the SomnoAI app:

## Required Sound Files

- `rain.mp3` - Rain sounds for calming ambience
- `ocean.mp3` - Ocean wave sounds for relaxation
- `fan.mp3` - White noise fan sounds
- `forest.mp3` - Forest ambience with birds and nature
- `white-noise.mp3` - White noise for sleep
- `pink-noise.mp3` - Pink noise for deep sleep
- `brown-noise.mp3` - Brown noise for anxiety relief
- `birdsong.mp3` - Gentle birdsong for peaceful mornings
- `wind.mp3` - Wind sounds for natural ambience

## File Requirements

- Format: MP3
- Duration: 10-30 minutes (looped)
- Quality: 128kbps or higher
- Volume: Normalized to prevent jarring transitions

## Usage

These files are referenced in the SoundMixer component. In a production app, you would:

1. Replace these placeholder references with actual audio files
2. Use proper audio loading with expo-av
3. Implement audio mixing and volume control
4. Add fade-in/fade-out transitions

## Demo Mode

For the demo, the app will show the sound mixer interface but won't actually play audio files. This allows you to test the UI and functionality without requiring actual sound files.
