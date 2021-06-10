const API_KEY = "e34b1cb04a474e9600a7d1c5ef07069f";

const searchForm = document.querySelector("#searchForm");
const searchBtn = document.querySelector("#searchBtn");
const movieArea = document.querySelector(".grid-container");
const loadMoreBtn = document.querySelector("#loadMoreBtn");

let timeWindow = "week";
let mediaType = "movie";
let page = 1;
let currentInput = "";


searchForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    const userInput = evt.target.input.value;

    //if search didn't change don't load anything
    if (inputSame(userInput))
        return;
    
    clearMovieArea();

    //Checks if search is empty and loads trending page if so
    if (userInput.trim() == "") {
        loadTrendingMovies();
        currentInput = userInput;
        return;
    }

    currentInput = userInput;
    const apiURL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${userInput}`;
    displayMovies(apiURL);
})

/**
 * 
 * @param {String} userInput 
 * @returns true if new input is same as the last input
 */
function inputSame(userInput) {
    return userInput.trim() === currentInput.trim();
}




loadMoreBtn.addEventListener("click", (evt) => {
    evt.preventDefault();

    page++;
    const apiURL = `https://api.themoviedb.org/3/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}&page=${page}`;
    displayMovies(apiURL);
});


/**
 * 
 * @param {String} targetURL - URL which is being searched
 * @returns Object containing web response as json object
 */
async function getResponse(targetURL) {
    const respone = await fetch(targetURL);
    const responseData = await respone.json();
    return responseData;
}

/**
 * 
 * @param {Object} responseData - json object containing movie information
 * @returns Object containing movieNames[], moviePoster[], movieRating[]
 */

function getMovieData(responseData) {

    const movieInformation = {
        movieNames: [],
        moviePosters: [],
        movieRatings: []
    }

    responseData.results.forEach((element) => {
        movieInformation.movieNames.push(element.original_title);
        movieInformation.moviePosters.push(element.poster_path);
        movieInformation.movieRatings.push(element.vote_average);
    });

    return movieInformation;
}

/**
 * 
 * @param {String} movieName - name of the movie
 * @param {String} moviePoster - movie poster file path
 * @param {Integer} movieRating - movie rating value
 * 
 * Adds a single movie to the page
 */
function addMovieToPage(movieName, moviePoster,  movieRating) {
    document.querySelector(".grid-container").innerHTML += `
    <div class="grid-item">
        <div class="movie-container">
            <img class="movie-image" src="https://image.tmdb.org/t/p/original/${moviePoster}" alt="Poster image of ${movieName}">
            <div class="movie-header">
                <div class="movie-title"><p>${movieName}</p></div>
                <div class="movie-rating"><p>&#11088 ${movieRating}</p></div>
            </div>
        </div>
    </div>
    `;
}

/**
 * Clears movies from page
 */
 function clearMovieArea() {
    movieArea.innerHTML = "";
}

/**
 * 
 * @param {Object} movieInformation - contains three keys: movieNames, moviePosters, movieRatings
 * 
 * Loads all movies to the page
 */
function loadMoviesToPage(movieInformation) {
    movieInformation.movieNames.forEach((element, index) => {
        addMovieToPage(element, movieInformation.moviePosters[index], movieInformation.movieRatings[index]);
    });
}

/**
 * Loads currently trending movies to the page
 */
function loadTrendingMovies() {
    const apiURL = `https://api.themoviedb.org/3/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}&page=${page}`
    displayMovies(apiURL);
}

/**
 * 
 * @param {String} apiURL - the url that is sent to the API
 * 
 * Calls API and displays movies to page
 */
async function displayMovies (apiURL) {
    const responseData = await getResponse(apiURL);
    movieInformation = getMovieData(responseData);
    loadMoviesToPage(movieInformation);

    const movieImages = document.querySelectorAll(".movie-image")

    movieImages.forEach((element) => {
        element.addEventListener("click", movieClick);
    })
}

function movieClick() {
    console.log("Clicked");
}

window.onload = onloadFunc;
async function onloadFunc () {

    loadTrendingMovies();
}