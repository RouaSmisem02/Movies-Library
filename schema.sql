CREATE TABLE Movies (
    id SERIAL PRIMARY KEY, /*Generate auto id*/
    title VARCHAR(255), /*take a title that allow to contain 255 character*/
    release_date DATE, /* allow to take a date*/
    poster_path VARCHAR(255),
    overview VARCHAR(10000)
);
