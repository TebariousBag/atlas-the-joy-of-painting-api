# ETL: The Joy of Coding

## My ERD
![alt text](images/image.png)

## My Tables
Focusing on filtering by air_date, subject, and colors used.

I have five tables.
* episodes
	* episode_id (PK)
	* title
	* air_date
* color
	* color_id (PK)
	* color_name
* subject
	* subject_id (PK)
	* subject_name
* episode_color (junction)
	* episode_id (FK)
	* color_id (FK)
* episode_subject (junction)
	* episode_id (FK)
	* subject_id (FK)

## What information to get from each file
* File 1
	* insert episodes, colors, and episode_color
* File 3
	* update episodes table with the air_date
* File 2
	* insert subjects and episode_subject
