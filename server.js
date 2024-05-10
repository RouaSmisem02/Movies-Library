const express = require('express');
const cors = require('cors');
const app = express();

const axios = require('axios');
app.use(cors());
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

//******************************************************************************************************************
//Lab-13
//app.get('/addMovie', getaddMovieHandler)
//app.post('/addMovie', addaddMovieHandler)

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

/*function addaddMovieHandler(req, res) {
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
    let sql = 'SELECT * FROM movies;'; 
        client.query(sql)
        .then((result) => {
            return res.status(200).json(result.rows);
        })
        .catch((error) => {
            console.error('Error fetching movies:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});*/

//********************************************************************************************

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

//***************************************************************************************************
//Lab-14
app.put('/update/:id',updateHandler);
app.delete('/deleteMovie/:id',deleteHandler);
app.get('/getmovie/:id', getmovieHandeler);
app.use(errorHandler);

//Update req
function updateHandler(req, res) {
    const id = req.params.id;

    const sql = `UPDATE movies SET title = $1, release_date = $2, poster_path = $3, overview = $4 WHERE id = ${id} RETURNING *;`
    const values = [req.body.title, req.body.release_date, req.body.poster_path, req.body.overview];
    client.query(sql, values)
        .then((data) => {
            res.status(200).send(data.rows)
        })
        .catch(error => {
            errorHandler(error, req, res);
        });
}

//delete req
function deleteHandler(req, res) {
    console.log("Delete route hit with ID:", req.params.id);
    const id = req.params.id;
    const sql = `DELETE FROM movies WHERE id = ${id}`;

    client.query(sql) // Corrected 'ID' to 'id'
        .then((result)=> {
            console.log('Movie deleted:', result.rows);
            res.status(204).json({});
            
        })
        .catch((error) => {
            console.error('Error deleting a movie:', error);
            res.status(500).send('Error deleting movie');
        });
}

// get req
function getmovieHandeler(req, res) {
    const id = req.params.id;
    const sql = `SELECT * FROM movies WHERE id = ${id}`;
    client.query(sql)
   .then((data) => {
        res.send(data.rows)
    })
    .catch((err) => {
        errorHandler(err, req, res);
    })
}








//***************************************************************************************************
function errorHandler(erorr, req, res) {
    const err = {
        status: 500,
        massage: erorr
    }
    res.status(500).send(err);
}

client.connect()
    .then(() => {
        app.listen(8080, () => {
            console.log("Listening to port 8080");
        });
})