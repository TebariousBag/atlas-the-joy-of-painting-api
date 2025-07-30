const client = require('../database/db');

// just trying to layout everything
const getAllEpisodes = async(req, res) => {
  try {
    // query for select all episodes
    const queryResult = await client.query('SELECT * FROM episodes ORDER BY episode_id');
    // send response of query as json
    res.json(queryResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'all episodes error' });
  }
};

const getAllSubjects = async(req, res) => {
  // just trying to get everything connected
  res.json({ message: 'testing routes, all subjects' });
}

const getAllColors = async(req, res) => {
  // just trying to get everything connected
  res.json({ message: 'testing routes, all colors' });
}

module.exports = {
  getAllEpisodes,
  getAllColors,
  getAllSubjects,
};
