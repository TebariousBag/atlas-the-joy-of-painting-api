# ETL: The Joy of Coding

## My ERD
![alt text](image.png)

## My Tables
Focusing on filtering by month, subject, and colors used.

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
	* composite PK: (episode_id, color_id)
* episode_subject (junction)
	* episode_id (FK)
	* subject_id (FK)
	* composite PK: (episode_id, subject_id)

