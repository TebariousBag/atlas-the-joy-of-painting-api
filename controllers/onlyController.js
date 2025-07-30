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
