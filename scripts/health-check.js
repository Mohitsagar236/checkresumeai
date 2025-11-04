// Health check script for Railway deployment
// This file provides health check functionality for Railway
// Updated: June 19, 2025

import http from 'http';
import axios from 'axios';

// Create a simple health check server (legacy for Render, but we'll keep it)
const healthCheck = http.createServer((req, res) => {
  if (req.url === '/healthz' || req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', environment: process.env.NODE_ENV || 'development' }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

const port = process.env.HEALTH_CHECK_PORT || 3001;
healthCheck.listen(port, () => {
  console.log(`Health check server running on port ${port}`);
});

// Function to check the main API health (used by Railway)
export async function checkApiHealth() {
  const baseUrl = process.env.API_URL || 'http://localhost:5000';
  const healthCheckUrl = `${baseUrl}/api/health`;
  
  try {
    const response = await axios.get(healthCheckUrl, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error('API health check failed:', error.message);
    return false;
  }
}

// Handle process termination
process.on('SIGTERM', () => {
  healthCheck.close(() => {
    console.log('Health check server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  healthCheck.close(() => {
    console.log('Health check server closed');
    process.exit(0);
  });
});

export default healthCheck;
