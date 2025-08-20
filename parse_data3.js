/**
 * ETL Pipeline: Dataset 3 Processing
 * 
 * This script processes the third dataset to update episode air dates
 * by matching episode titles with air dates and updating the database
 * 
 * @author Tristian Davis
 * @version 1.0.0
 */

const fs = require('fs');
const readline = require('readline');
const { Client } = require('pg');

/**
 * Database client configuration
 * Uses environment variables for production deployment
 */
const client = new Client({
  user: process.env.DB_USER || 'tebariousbag',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bobbie_ross',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

/**
 * Main ETL processing function
 * Updates episode air dates from CSV data
 */
async function processDataset3() {
  try {
    // Establish database connection
    await client.connect();
    console.log('✅ Connected to PostgreSQL database');
    
    // Retrieve all episode IDs in order for mapping
    const result = await client.query('SELECT episode_id FROM episodes ORDER BY episode_id');
    const episodeIds = result.rows.map(row => row.episode_id);
    
    // Create file stream and line reader
    const fileStream = fs.createReadStream('datasets/dataset3.csv');
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let index = 0;
    let updatedCount = 0;
    let errorCount = 0;
    
    console.log('🔄 Starting air date updates...');
    
    // Process each line in the CSV file
    for await (const line of rl) {
      if (!line.trim()) continue;
      
      // Parse title and date using regex pattern matching
      const match = line.match(/^"(.+?)"\s+\((.+?)\)$/);
      if (!match) {
        console.warn(`⚠️  Skipping malformed line: ${line}`);
        errorCount++;
        continue;
      }

      const title = match[1].trim();
      const dateStr = match[2].trim();
      const airDate = new Date(dateStr);

      // Validate date format
      if (isNaN(airDate.getTime())) {
        console.warn(`⚠️  Invalid date format: ${dateStr}`);
        errorCount++;
        continue;
      }

      const episodeId = episodeIds[index];
      index++;

      // Update episode with air date
      await client.query(
        `UPDATE episodes SET air_date = $1 WHERE episode_id = $2`,
        [airDate.toISOString().split('T')[0], episodeId]
      );
      
      updatedCount++;
      console.log(`✅ Updated episode ${episodeId}: "${title}" - ${airDate.toDateString()}`);
    }

    // Processing complete
    console.log('\n🎉 Dataset 3 processing completed!');
    console.log(`📊 Statistics:`);
    console.log(`   - Successfully updated: ${updatedCount} episodes`);
    console.log(`   - Errors encountered: ${errorCount}`);
    
  } catch (error) {
    console.error('❌ Fatal error during processing:', error);
    throw error;
  } finally {
    // Clean up database connection
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

/**
 * Execute the ETL process
 * Handles any uncaught errors
 */
processDataset3()
  .then(() => {
    console.log('🎨 Dataset 3 ETL process completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 ETL process failed:', error);
    process.exit(1);
  });
