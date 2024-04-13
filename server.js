const express = require("express");

const app = express();

const moviesData = require('./Movie Data/data.json');

function Movie(title, posterPath, overview) {
    this.title = title;              
    this.posterPath = posterPath;    
    this.overview = overview;   
}

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