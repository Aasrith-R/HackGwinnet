const { spawn } = require('child_process');
const path = require('path');

console.log('🌙 Starting SomnoAI with tunnel mode...');
console.log('📱 This will create a QR code for testing on your phone');

// Start Expo with tunnel mode
const expoProcess = spawn('npx', ['expo', 'start', '--tunnel'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

expoProcess.on('error', (error) => {
  console.error('❌ Error starting Expo:', error);
  console.log('\n🔧 Alternative: Try running this command manually:');
  console.log('npx expo start --tunnel');
});

expoProcess.on('close', (code) => {
  console.log(`\n📱 Expo process exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping Expo...');
  expoProcess.kill('SIGINT');
  process.exit(0);
});
