const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Minimal configuration to avoid file watching issues
config.watchFolders = [];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];

// Disable file watching completely
config.watcher = {
  additionalExts: [],
  watchman: {
    deferStates: ['hg.update'],
  },
};

// Use minimal file watching
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];

module.exports = config;
