const express = require("express");

const app = express();

const axios = require('axios');
require('dotenv').config();

const moviesData = require('./Movie Data/data.json');

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

app.listen(8080, () => {
    console.log("Listening to port 8080");
  });