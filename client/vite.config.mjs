import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { spawn } from 'child_process';
import path from 'path';

// Workaround: start the backend server automatically when Vite starts
if (!global.__backend_spawned) {
  global.__backend_spawned = true;
  console.log('Spawning backend server...');
  const serverDir = path.resolve(__dirname, '../server');
  const backend = spawn('node', ['app.js'], {
    cwd: serverDir,
    stdio: 'inherit',
  });
  backend.on('error', (err) => {
    console.error('Failed to start backend server:', err);
  });
  process.on('exit', () => backend.kill());
}

if (!global.__check_spawned) {
  global.__check_spawned = true;
  const serverDir = path.resolve(__dirname, '../server');
  const checker = spawn('node', ['tmp-check.js'], {
    cwd: serverDir,
    stdio: 'inherit',
  });
  process.on('exit', () => checker.kill());
}

export default defineConfig({
  plugins: [react()],
});
