const client = require('../database/db');

// create an index for matching month to number value
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

// just trying to layout everything
const getAllEpisodes = async(req, res) => {
  try {
    console.log('getAllEpisodes was called');
    const { month } = req.query;
    console.log('Received month:', month);
    let queryText = 'SELECT * FROM episodes';
    const params = [];

    if (month) {
      let monthNumber = parseInt(month, 10);
      // convert from string to number if needed
      if (isNaN(monthNumber)) {
        monthNumber = monthMap[month.toLowerCase()];
      }

      if (!monthNumber || monthNumber < 1 || monthNumber > 12) {
        return res.status(400).json({ error: 'Invalid month. Use number (1–12) or month name.' });
      }
      // our query text
      queryText += ' WHERE EXTRACT(MONTH FROM air_date) = $1';
      params.push(monthNumber);
    }

    queryText += ' ORDER BY episode_id';
    // logging to find problems
    console.log('Final query:', queryText);
    console.log('With params:', params);

    const queryResult = await client.query(queryText, params);
    res.json(queryResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'all episodes error' });
  }
};

const getAllSubjects = async(req, res) => {
  try {
    // query for select all subjects
    const queryResult = await client.query('SELECT * FROM subjects ORDER BY subject_id');
    // send response of query as json
    res.json(queryResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'all subjects error' });
  }
};

const getAllColors = async(req, res) => {
  try {
    // query for select all colors
    const queryResult = await client.query('SELECT * FROM colors ORDER BY color_id');
    // send response of query as json
    res.json(queryResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'all colors error' });
  }
};


module.exports = {
  getAllEpisodes,
  getAllColors,
  getAllSubjects,
};
