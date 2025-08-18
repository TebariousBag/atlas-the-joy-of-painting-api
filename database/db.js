const { Client } = require('pg');

/**
 * PostgreSQL client configuration
 * Supports environment variables for production deployment
 */
const client = new Client({
  user: process.env.DB_USER || 'tebariousbag',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bobbie_ross',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

/**
 * Initialize database connection
 * Handles connection errors gracefully
 */
const initializeDatabase = async () => {
  try {
    await client.connect();
    console.log('✅ Successfully connected to PostgreSQL database');
    
    // Test the connection with a simple query
    const result = await client.query('SELECT NOW()');
    console.log(`📅 Database timestamp: ${result.rows[0].now}`);
    
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    console.error('💡 Please check your database configuration and ensure PostgreSQL is running');
    process.exit(1); // Exit if we can't connect to the database
  }
};

// Initialize the database connection
initializeDatabase();

// Handle connection errors after initial connection
client.on('error', (err) => {
  console.error('❌ Database connection error:', err);
  console.error('💡 Attempting to reconnect...');
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  try {
    await client.end();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during shutdown:', err);
    process.exit(1);
  }
});

module.exports = client;
