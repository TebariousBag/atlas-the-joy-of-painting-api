// we import filesystem
const fs = require('fs');
const readline = require('readline');
// and this is for postgres
const { Client } = require('pg');


const client = new Client({
  user: 'tebariousbag',
  host: 'localhost',
  database: 'bobbie_ross',
  // no current password
  password: '',
  port: 5432,
});

async function run() {
  // first we connect to our postgres server
  await client.connect();
  // query to get all the episode ids
  const result = await client.query('SELECT episode_id FROM episodes ORDER BY episode_id');
  // we already know its in the proper order as the other files
  // so we just map the correct id to the correct row
  const episodeIds = result.rows.map(row => row.episode_id);
  // nthe file we are reading
  const fileStream = fs.createReadStream('datasets/dataset3.csv');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let index = 0;
  // loop through our data one line at a time
  // trimming whitespace
  for await (const line of rl) {
    if (!line.trim()) continue;
    // i am not a fan of regex
    const match = line.match(/^"(.+?)"\s+\((.+?)\)$/);
    // if something isnt right we dont want to add the data to table
    if (!match) {
      console.warn(`line did not match ${line}`);
      continue;
    }

    const title = match[1].trim();
    const dateStr = match[2].trim();
    const airDate = new Date(dateStr);

    if (isNaN(airDate.getTime())) {
      console.warn(`Invalid date: ${dateStr}`);
      continue;
    }

    const episodeId = episodeIds[index];
    index++;

    await client.query(
      `UPDATE episodes SET air_date = $1 WHERE episode_id = $2`,
      [airDate.toISOString().split('T')[0], episodeId]
    );
    // log the airdate
    console.log(`Updated episode_id ${episodeId} (${title}) with air_date ${airDate.toDateString()}`);
  }

    // log when the file is done being added
  await client.end();
  console.log(' \n -------------------------------- ');
  console.log(' \n Dataset3.csv is done being added. \n');
  console.log(' \n -------------------------------- ');
}

run().catch(console.error);
