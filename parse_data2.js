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

  // selecting all episodes from our last dataset since we know they are in the same order
  const episodeQuery = await client.query('SELECT episode_id FROM episodes ORDER BY episode_id');
  // for each row we loop through and update the episode_id to match
  // this will hold all the id's we will loop through
  const episodeIds = episodeQuery.rows.map(each => each.episode_id);

  // we stream and parse the dataset
  // and match the first line to the header names
  const parser = fs.createReadStream('datasets/dataset2.csv').pipe(parse({ columns: true, trim: true }));

  let rowIndex = 0;

  for await (const row of parser) {
    try {
      // gte current episode id from list of ids we have
	  // and increment each time
      const episodeId = episodeIds[rowIndex];
      rowIndex++;

      // if keyname is title or episode we want to just skip that and continue
	    // to our othe key value pairs
      for (const [keyName, value] of Object.entries(row)) {
        if (keyName === 'EPISODE' || keyName === 'TITLE') continue;

        // skipped title and episode, so now we have our booleans
		    // should look like this ['CABIN', 1]
		    // so if it is 1 or is true
        if (value === '1' || value === 1) {
          // here is where we insert the subject name
		      // which is our keyName we just got
		      // if conflict we just update it
		      // that way we still return the current subject
          const subjectQuery = await client.query(
            `INSERT INTO subjects (subject_name)
            VALUES ($1)
            ON CONFLICT (subject_name) DO UPDATE
            SET subject_name = EXCLUDED.subject_name
            RETURNING subject_id`,
            [keyName]
          );
          // we want to make sure we are using the id of the subject we just inserted
		      const subjectId = subjectQuery.rows[0].subject_id;

          // now add those id's into our junction table
          await client.query(
            `INSERT INTO episode_subjects (episode_id, subject_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [episodeId, subjectId]
          );
          // log to make sure subject was added to episode
          console.log(`Subject '${keyName}' added to episode ${episodeId}`);
        }
      }
      // log for episode being added
      console.log(' \n -------------------------------- ');
      console.log(` \n Processed episode ${episodeId} - ${row.TITLE} (above)`);
      console.log(' \n -------------------------------- ');

    } catch (err) {
      console.error('Error while processing row:', err);
    }
  }
  // log when the file is done being added
  await client.end();
  console.log(' \n -------------------------------- ');
  console.log(' \n Dataset2.csv is done being added. \n');
  console.log(' \n -------------------------------- ');
}

// run function and catch errors to console
run().catch(console.error);
