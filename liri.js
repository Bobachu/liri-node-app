// npm requirements
require("dotenv").config();
const Spotify = require('node-spotify-api');
const keys = require("./keys.js");
const axios = require("axios");
const fs = require("fs");
const moment = require("moment");
// other varables
let option = process.argv[2];
process.argv.splice(0, 3);
var userInput = process.argv.join(" ");

//switch statement 
switch (option) {
    case "concert-this":
        concertThis();
        break;
    case "spotify-this-song":
        spotifySong();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doIt();
        break;
    default:
        console.log("Please enter one of the following commands after node liri.js followed by your query: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says");
        break;
}

// Function for getting concert info from bands in town api
function concertThis() {
    const bandsUrl = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp&date=upcoming";

    axios.get(bandsUrl)
        .then(function (response) {
            var data = response.data;
            if (data.length === 0) {
                console.log("Looks like they aren't touring :(");
            } else {
            for (var i = 0; i < data.length; i++) {
                let venueLoc = data[i].venue.name;
                let venueCity = data[i].venue.city;
                let eventDate = data[i].datetime;
                
                    let concertInfo = "\nThe location is: " + venueLoc + "\nWhich is in: " + venueCity + "\nAnd is on: " + moment(eventDate).format("MM/DD/YYYY")
                    console.log(concertInfo);

                    // search and its info appended to log.txt
                    fs.appendFile("log.txt", "\n\nSearch " + userInput + concertInfo, function (err) {
                        if (err) throw err;
                    })
                }
            }

        }).catch(function (error) {
            console.log(error);
        });
}

// function for getting song info from spotify
function spotifySong() {
    if (userInput) {
        var spotify = new Spotify(keys.spotify)
        spotify.search({ type: 'track', query: userInput }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            let songInfo = "\nArtist: " + data.tracks.items[0].artists[0].name + "\nSong: " + data.tracks.items[0].name + "\nLink: " + data.tracks.items[0].external_urls.spotify + "\nAlbum: " + data.tracks.items[0].album.name;
            console.log(songInfo);

            // search and its info appended to log.txt
            fs.appendFile("log.txt", "\n\nSearch " + userInput + songInfo, function (err) {
                if (err) throw err;
            })


        });
    } else {
        var spotify = new Spotify(keys.spotify)
        userInput = "the sign ace of base"
        spotify.search({ type: 'track', query: userInput }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            let songInfo = "\nArtist: " + data.tracks.items[0].artists[0].name + "\nSong: " + data.tracks.items[0].name + "\nLink: " + data.tracks.items[0].external_urls.spotify + "\nAlbum: " + data.tracks.items[0].album.name;
            console.log(songInfo);
        })
    }
}


// function for getting movie info from omdb api
function movieThis() {
    const omdbUrl = "https://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";

    axios.get(omdbUrl).then(function (response) {
        if (userInput) {
            let movieInfo = "\nThe movie is: " + response.data.Title + "\nThe release year is: " + response.data.Year + "\nThe IMDb rating is: " + response.data.imdbRating + "\nThe Rotten Tomatoes rating is: " + response.data.Ratings[1].Value + "\nThe movie was made in: " + response.data.Country + "\nlanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nStarring: " + response.data.Actors
            console.log(movieInfo);

            // search and its info appended to log.txt
            fs.appendFile("log.txt", "\n\nSearch " + userInput + movieInfo, function (err) {
                if (err) throw err;
            })


        } else {
            console.log("\nIf you haven't watched \"Mr. Nobody,\" then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
        }
    }).catch(function (error) {
        console.log(error);
    });
}

// function to run whats in a text file
function doIt() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        let doItRes = data.split(",");
        userInput = doItRes[1].replace(/"/g, "");
        // console.log(doItRes);
        if (doItRes[0] === "spotify-this-song") {
            // userInput = doItRes[1];
            spotifySong();
        } else if (doItRes[0] === "movie-this") {
            // userInput = doItRes[1];
            movieThis();
        } else if (doItRes[0] === "concert-this") {
            // userInput = doItRes[1];
            concertThis();
        }

    })

}