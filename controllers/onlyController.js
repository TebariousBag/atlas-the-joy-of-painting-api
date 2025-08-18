const client = require('../database/db');

/**
 * Month mapping for converting month names to numbers
 * Supports both numeric (1-12) and text-based month inputs
 */
const monthMap = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

/**
 * Retrieves all episodes with optional month filtering
 * Supports both numeric (1-12) and text-based month inputs
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string|number} req.query.month - Month filter (1-12 or month name)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with episodes array or error message
 */
const getAllEpisodes = async (req, res) => {
  try {
    console.log('getAllEpisodes endpoint called');
    const { month } = req.query;
    console.log('Received month filter:', month);
    
    let queryText = 'SELECT * FROM episodes';
    const params = [];

    // Apply month filtering if provided
    if (month) {
      let monthNumber = parseInt(month, 10);
      
      // Handle text-based month inputs (e.g., "january", "January")
      if (isNaN(monthNumber)) {
        monthNumber = monthMap[month.toLowerCase()];
      }

      // Validate month range (1-12)
      if (!monthNumber || monthNumber < 1 || monthNumber > 12) {
        return res.status(400).json({ 
          error: 'Invalid month parameter. Use number (1-12) or month name.',
          validFormats: ['1-12', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
        });
      }
      
      // Build query with month filter
      queryText += ' WHERE EXTRACT(MONTH FROM air_date) = $1';
      params.push(monthNumber);
    }

    // Order results by episode ID for consistent output
    queryText += ' ORDER BY episode_id';
    
    // Log final query for debugging
    console.log('Executing query:', queryText);
    console.log('Query parameters:', params);

    const queryResult = await client.query(queryText, params);
    
    // Return successful response with episodes
    res.json({
      success: true,
      count: queryResult.rows.length,
      episodes: queryResult.rows
    });
    
  } catch (err) {
    console.error('Error in getAllEpisodes:', err);
    res.status(500).json({ 
      error: 'Internal server error while retrieving episodes',
      message: 'Please try again later or contact support if the issue persists'
    });
  }
};

/**
 * Retrieves all available painting subjects
 * Returns subjects ordered by ID for consistent results
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with subjects array or error message
 */
const getAllSubjects = async (req, res) => {
  try {
    console.log('getAllSubjects endpoint called');
    
    const queryText = 'SELECT * FROM subjects ORDER BY subject_id';
    const queryResult = await client.query(queryText);
    
    // Return successful response with subjects
    res.json({
      success: true,
      count: queryResult.rows.length,
      subjects: queryResult.rows
    });
    
  } catch (err) {
    console.error('Error in getAllSubjects:', err);
    res.status(500).json({ 
      error: 'Internal server error while retrieving subjects',
      message: 'Please try again later or contact support if the issue persists'
    });
  }
};

/**
 * Retrieves all paint colors used in the show
 * Returns colors ordered by ID for consistent results
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with colors array or error message
 */
const getAllColors = async (req, res) => {
  try {
    console.log('getAllColors endpoint called');
    
    const queryText = 'SELECT * FROM colors ORDER BY color_id';
    const queryResult = await client.query(queryText);
    
    // Return successful response with colors
    res.json({
      success: true,
      count: queryResult.rows.length,
      colors: queryResult.rows
    });
    
  } catch (err) {
    console.error('Error in getAllColors:', err);
    res.status(500).json({ 
      error: 'Internal server error while retrieving colors',
      message: 'Please try again later or contact support if the issue persists'
    });
  }
};

module.exports = {
  getAllEpisodes,
  getAllColors,
  getAllSubjects,
};
