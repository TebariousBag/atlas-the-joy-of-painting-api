const client = require('../database/db');

// just trying to layout everything
const getAllEpisodes = async(req, res) => {
  // just trying to get everything connected
  res.json({ message: 'testing routes, all episodes' });
}

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
