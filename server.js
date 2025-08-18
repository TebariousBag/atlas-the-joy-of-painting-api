const express = require('express');
const cors = require('cors');

// Import route modules
const episodesRoutes = require('./routes/episodeRouter');
const subjectsRoutes = require('./routes/subjectRouter');
const colorsRoutes = require('./routes/colorRouter');

/**
 * Express application instance
 * Main server configuration and middleware setup
 */
const app = express();

// Server configuration
const PORT = process.env.PORT || 3432;

// Middleware configuration
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// Route mounting
app.use('/episodes', episodesRoutes);
app.use('/subjects', subjectsRoutes);
app.use('/colors', colorsRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'The Joy of Painting API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      episodes: '/episodes',
      subjects: '/subjects',
      colors: '/colors'
    }
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on our end. Please try again later.'
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist.`,
    availableRoutes: ['/episodes', '/subjects', '/colors']
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🎨 The Joy of Painting API is running on http://localhost:${PORT}`);
  console.log(`📚 Available endpoints:`);
  console.log(`   - GET /episodes - Retrieve episodes with filtering`);
  console.log(`   - GET /subjects - Get all painting subjects`);
  console.log(`   - GET /colors - Get all paint colors`);
  console.log(`   - GET / - API information and health check`);
});
