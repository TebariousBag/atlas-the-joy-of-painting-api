# ETL: The Joy of Coding

## Overview
This API provides access to The Joy of Painting episodes with advanced filtering capabilities. The API allows users to filter episodes by month, subject matter, and color palette with support for multiple filters and AND/OR logic.

## My ERD
![alt text](images/image.png)

## My Tables
Focusing on filtering by air_date, subject, and colors used.

I have five tables.
* episodes
	* episode_id (PK)
	* title
	* air_date
* colors
	* color_id (PK)
	* color_name
* subjects
	* subject_id (PK)
	* subject_name
* episode_colors (junction)
	* episode_id (FK)
	* color_id (FK)
* episode_subjects (junction)
	* episode_id (FK)
	* subject_id (FK)

## What information to get from each file
* File 1
	* insert episodes, colors, and episode_color
* File 3
	* update episodes table with the air_date
* File 2
	* insert subjects and episode_subject

## Setup

Connect to PostgreSQL
psql -U your_username

Create the database
CREATE DATABASE bobbie_ross;

Connect to the new database
\c bobbie_ross

### Run the Schema
psql -U your_username -d bobbie_ross -f bobbie_ross_schema.sql

This Creates 5 tables: `episodes`, `subjects`, `colors`, `episode_subjects`, `episode_colors`

You can then connect an check that the tables were created
Connect to the database
psql -U your_username -d bobbie_ross
And list all tables
\dt

These three files will read our data files and import the data we are looking for into the appropriate tables
node parse_data1.js
node parse_data2.js
node parse_data3.js

# Testing API endpoints
# Test month filtering
curl "http://localhost:3432/episodes?month=1"

# Test subject filtering
curl "http://localhost:3432/episodes?subjects=TREES"

# Test color filtering
curl "http://localhost:3432/episodes?colors=Alizarin%20Crimson"

# Test complex filtering
curl "http://localhost:3432/episodes?month=1&subjects=TREES&colors=Alizarin%20Crimson&filterLogic=AND"
