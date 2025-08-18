/**
 * ETL Pipeline: Dataset 1 Processing
 * 
 * This script processes the first dataset to populate:
 * - episodes table (titles)
 * - colors table (paint colors)
 * - episode_colors junction table
 * 
 * @author Tebarious Bag
 * @version 1.0.0
 */

const fs = require('fs');
const { parse } = require('csv-parse');
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
 * Reads CSV data and populates the database tables
 */
async function processDataset1() {
  try {
    // Establish database connection
    await client.connect();
    console.log('✅ Connected to PostgreSQL database');
    
    // Create CSV parser with proper configuration
    const parser = fs.createReadStream('datasets/dataset1.csv')
      .pipe(parse({ 
        columns: true, 
        trim: true,
        skip_empty_lines: true
      }));
    
    let processedCount = 0;
    let errorCount = 0;
    
    console.log('🔄 Starting data processing...');
    
    // Process each row in the CSV file
    for await (const row of parser) {
      try {
        // Extract and clean episode title
        const title = row.painting_title?.trim();
        if (!title) {
          console.warn('⚠️  Skipping row with empty title');
          continue;
        }

        // Insert episode record
        const episodeQuery = await client.query(
          `INSERT INTO episodes (title, air_date) VALUES ($1, NULL) RETURNING episode_id`,
          [title]
        );
        
        const episodeId = episodeQuery.rows[0].episode_id;
        console.log(`📺 Processing episode: ${title} (ID: ${episodeId})`);

        // Parse color data from JSON strings
        const colorNames = parseColorData(row.colors);
        const colorHexes = parseColorData(row.color_hex);

        // Process each color for the episode
        for (let i = 0; i < colorNames.length; i++) {
          const colorName = colorNames[i];
          const colorHex = colorHexes[i];
          
          if (!colorName) continue;

          // Insert or update color record
          const colorQuery = await client.query(
            `INSERT INTO colors (color_name, color_hex)
             VALUES ($1, $2)
             ON CONFLICT (color_name) DO UPDATE
             SET color_hex = EXCLUDED.color_hex
             RETURNING color_id`,
            [colorName, colorHex]
          );
          
          const colorId = colorQuery.rows[0].color_id;

          // Create episode-color relationship
          await client.query(
            `INSERT INTO episode_colors (episode_id, color_id) 
             VALUES ($1, $2) 
             ON CONFLICT DO NOTHING`,
            [episodeId, colorId]
          );
          
          console.log(`    🎨 Added color: ${colorName} (ID: ${colorId})`);
        }

        processedCount++;
        console.log(`✅ Episode processed successfully: ${title}`);
        console.log('─────────────────────────────────────────');
        
      } catch (rowError) {
        errorCount++;
        console.error(`❌ Error processing row:`, rowError);
        console.error(`Row data:`, row);
      }
    }

    // Processing complete
    console.log('\n🎉 Dataset 1 processing completed!');
    console.log(`📊 Statistics:`);
    console.log(`   - Successfully processed: ${processedCount} episodes`);
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
 * Parse color data from JSON string format
 * Handles single quote to double quote conversion
 * 
 * @param {string} colorData - JSON string containing color information
 * @returns {Array} Array of color names/values
 */
function parseColorData(colorData) {
  if (!colorData) return [];
  
  try {
    // Convert single quotes to double quotes for valid JSON
    const cleanData = colorData.replace(/'/g, '"');
    return JSON.parse(cleanData).map(color => color?.trim()).filter(Boolean);
  } catch (parseError) {
    console.warn('⚠️  Failed to parse color data:', parseError.message);
    return [];
  }
}

/**
 * Execute the ETL process
 * Handles any uncaught errors
 */
processDataset1()
  .then(() => {
    console.log('🎨 Dataset 1 ETL process completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 ETL process failed:', error);
    process.exit(1);
  });
