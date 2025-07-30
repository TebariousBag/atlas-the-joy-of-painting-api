const express = require('express');
const cors = require('cors');
// connection to routers
const episodesRoutes = require('./routes/episodeRouter');
const subjectsRoutes = require('./routes/subjectRouter');
const colorsRoutes = require('./routes/colorRouter');

const app = express();
// i might need to change this
const PORT = 3432;
// use cors to allow requests from different ports
app.use(cors());
// so we can parse json into js
app.use(express.json());

// mount routes for each
app.use('/episodes', episodesRoutes);
app.use('/subjects', subjectsRoutes);
app.use('/colors', colorsRoutes);

// log for / endpoint
// testing to make sure it works
app.get('/', (req, res) => {
  res.send('this is bobbie ross');
});

// start listening, and log which port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
