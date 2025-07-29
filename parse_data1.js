// we import filesystem
const fs = require('fs');
// import for parsing csv files
const { parse } = require('csv-parse');
// and this is for postgres
const { Client } = require('pg');
// how we connect to postgres
const client = new Client({
  user: 'tebariousbag',
  host: 'localhost',
  database: 'bobbie_ross',
  // no current password
  password: '',
  port: 5432,
});

async function run() {
  await client.connect();
  // read stream from first file, columns true treats the first line as header
  // and use those headers as keys for the data in each row
  const parser = fs.createReadStream('dataset1.csv').pipe(parse({ columns: true, trim: true }));
  // loop through each line that we parsed
  for await (const row of parser) {
    try {
      // for finding episode title, in this file it is painting_title
      const title = row.painting_title.trim();

      // insert into episode table with title, we dont have air_date yet
      const episodeQuery = await client.query(
        `INSERT INTO episodes (title, air_date) VALUES ($1, NULL) RETURNING episode_id`,
        [title]
      );
	  // rows is gonna be an array of rows
	  // so rows 0 will be the first row of data
      const episodeId = episodeQuery.rows[0].episode_id;

      // parse the row of colors and replace all single quotes with double quotes
	  // globally, so that it is in correct format
      const colorNames = JSON.parse(row.colors.replace(/'/g, '"')).map(color => color.trim());


	  // might use hex codes later
      const colorHexes = JSON.parse(row.color_hex.replace(/'/g, '"')).map(color => color.trim());


	  // now we can loop through our list of color names assigning
	  // the one we want to grab
      for (let i = 0; i < colorNames.length; i++) {
        const colorName = colorNames[i];
		// now we insert that colorName we currently have into the row color_name
		// using update to make sure we still have current colorName
		// this returns the id to colorQuery
		const colorQuery = await client.query(
          `INSERT INTO color (color_name)
           VALUES ($1)
           ON CONFLICT (color_name) DO UPDATE
           SET color_name = EXCLUDED.color_name
           RETURNING color_id`,
          [colorName]
        );
		// an array of row objects, so we want the first row
		// which is index 0
        const colorId = colorQuery.rows[0].color_id;

        await client.query(
          `INSERT INTO episode_color (episode_id, color_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [episodeId, colorId]
        );
		// log that color was added
		console.log(`    color was added: ${colorName}, ID: ${colorId})`);
      }

	  // log each time an episode is added
      console.log(`  INSERTED EPISODE: ${title}`);
	  // and log if there was an error adding an episode
    } catch (err) {
      console.error('Error adding episode:', err);
    }
  }
  // log when the whole file has beed added
  await client.end();
  console.log(' \n Dataset1.csv is done being added. \n');
}

// finally we run it and catch any errors
run().catch(console.error);
