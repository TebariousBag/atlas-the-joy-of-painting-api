-- Drop tables if they exist already, so that way we are starting fresh each time
DROP TABLE IF EXISTS episode_color;
DROP TABLE IF EXISTS episode_subject;
DROP TABLE IF EXISTS color;
DROP TABLE IF EXISTS subject;
DROP TABLE IF EXISTS episodes;


-- Creating our 5 main tables I decided to start with

-- 3 main tables first with primary keys
-- Episodes Table
-- using serial primary key to increment id each time a new row is created
CREATE TABLE episodes (
    episode_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    air_date DATE
);
-- color Table
CREATE TABLE color (
    color_id SERIAL PRIMARY KEY,
    color_name TEXT UNIQUE NOT NULL
);
-- Subject table
CREATE TABLE subject (
    subject_id SERIAL PRIMARY KEY,
    subject_name TEXT UNIQUE NOT NULL
);

-- and then our 2 junction tables
-- episode subject
CREATE TABLE episode_subject (
    episode_id INT NOT NULL,
    subject_id INT NOT NULL,
    PRIMARY KEY (episode_id, subject_id),
	-- on delete cascade, delete the rows underneath it
    FOREIGN KEY (episode_id) REFERENCES episodes(episode_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id) ON DELETE CASCADE
);
-- episode color
CREATE TABLE episode_color (
    episode_id INT NOT NULL,
    color_id INT NOT NULL,
    PRIMARY KEY (episode_id, color_id),
	-- on delete cascade, delete the rows underneath it
    FOREIGN KEY (episode_id) REFERENCES episodes(episode_id) ON DELETE CASCADE,
    FOREIGN KEY (color_id) REFERENCES color(color_id) ON DELETE CASCADE
);
