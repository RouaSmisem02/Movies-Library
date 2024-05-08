const express = require("express");

const app = express();

const axios = require('axios');
app.use(express.json())

const pg = require('pg')

require('dotenv').config();

const moviesData = require('./Movie Data/data.json');

const client = new pg.Client('postgresql://localhost:5432/moviesdatabase')

function Movie(id, title,release_date, posterPath, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;              
    this.posterPath = posterPath;    
    this.overview = overview;   
}

app.get('/trending', (req, res) => {
    try{
        const APIKey = process.env.APIKey;
        const URL = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKey}&language=en-US`;
        axios.get(URL)
        .then((result) => {
            let mapResult = result.data.results.map((movie)=> {
                let singleMovie = new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview)
                return singleMovie
            })
            res.send(mapResult)
        })
    }
        catch(err){
            console.log("sorry", err);
            res.status(500).send(err);
        }
    
});


app.get('/search', (req, res) => {
   
    try{
        const APIKey = process.env.APIKey;
        const URL = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=en-US&query=John&page=1`;
        axios.get(URL)
        .then((result) => {
            let mapResult = result.data.results.map((movie)=> {
                let singleMovie = new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview)
                return singleMovie
            })
            res.send(mapResult)
        })
    }
        catch(err){
            console.log("sorry", err);
            res.status(500).send(err);
        }
    
});

app.get('/discover', (req, res) => {
   
    try{
        const APIKey = process.env.APIKey;
        const URL = `https://api.themoviedb.org/3/discover/movie?api_key=${APIKey}&language=en-US`;
        axios.get(URL)
        .then((result) => {
            let mapResult = result.data.results.map((movie)=> {
                let singleMovie = new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview)
                return singleMovie
            })
            res.send(mapResult)
        })
    }
        catch(err){
            console.log("sorry", err);
            res.status(500).send(err);
        }
    
});

app.get('/now_playing', (req, res) => {
   
    try{
        const APIKey = process.env.APIKey;
        const URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${APIKey}&language=en-US`;
        axios.get(URL)
        .then((result) => {
            let mapResult = result.data.results.map((movie)=> {
                let singleMovie = new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview)
                return singleMovie
            })
            res.send(mapResult)
        })
    }
        catch(err){
            console.log("sorry", err);
            res.status(500).send(err);
        }
    
});

app.get('/', (req, res) => {
    const movie = new Movie(moviesData.title, moviesData.poster_path, moviesData.overview);
    res.json(movie);
});

app.get('/favorite', (req, res) => {
    res.send("Welcome to Favorite Page");
});
app.get('/addMovie', getaddMovieHandler)
app.post('/addMovie', addaddMovieHandler)

function getaddMovieHandler(req, res){
    const sql = 'SELECT * FROM movies';
    client.query(sql)
    .then((data) => {
        res.send(data.rows)
    })
    .catch((err) => {
        errorHandler(err, req, res);
    })
}

function addaddMovieHandler(req, res) {
    const movie = req.body;
    console.log('Received movies data:', movie);

    const sql = 'INSERT INTO movies (id, title, release_date, poster_path, overview) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview];

    client.query(sql, values)
        .then((data) => {
            console.log('Successfully inserted movie:', data.rows[0]);
            res.send("Your data was added");
        })
        .catch(error => {
            console.error('Error inserting movie:', error);
            res.status(500).send("Internal Server Error");
        });
}
app.get('/viewmovies', (req, res) => {
    let sql = 'SELECT * FROM movies;'; // Corrected table name from 'movie' to 'movies'
    client.query(sql)
        .then((result) => {
            return res.status(200).json(result.rows);
        })
        .catch((error) => {
            console.error('Error fetching movies:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



app.use((req, res) => {
    res.status(404).send({
        status: 404,
        responseText: "Sorry, page not found"
    });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        status: 500,
        responseText: "Sorry, something went wrong with the server"
    });
});

client.connect()
    .then(() => {
        app.listen(8080, () => {
            console.log("Listening to port 8080");
          });
    });
// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send({
        status: 500,
        responseText: 'Sorry, something went wrong with the server'
    });
});

// Connect to PostgreSQL database
client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database');

        // Start Express server
        app.listen(8080, () => {
            console.log('Express server is listening on port 8080');
        });
    })
    .catch(error => {
        console.error('Error connecting to PostgreSQL database:', error.message);
    });
