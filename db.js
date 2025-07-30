const { Client } = require('pg');

const client = new Client({
  user: 'tebariousbag',
  host: 'localhost',
  database: 'bobbie_ross',
  // no current password
  password: '',
  port: 5432,
});

client.connect();

// i always forget to export
module.exports = client;
