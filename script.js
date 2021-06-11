const API_KEY = "e34b1cb04a474e9600a7d1c5ef07069f";

const searchForm = document.querySelector("#searchForm");
const searchBtn = document.querySelector("#searchBtn");
const movieArea = document.querySelector("#movieDisplay");
const loadMoreBtn = document.querySelector("#loadMoreBtn");

let currentPage = document.querySelector(".currentPage");
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
        page = 1;
        loadTrendingMovies();
        currentInput = userInput;
        return;
    }

    currentInput = userInput;
    currentPage.innerHTML = `Search Results: ${currentInput}`;

    page = 1;
    const apiURL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${userInput}&page=${page}`;
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
    let apiURL = "";

    if (viewingTrending()) {
        apiURL = `https://api.themoviedb.org/3/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}&page=${page}`;
    }
    else {
        console.log("search")
        apiURL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${currentInput}&page=${page}`;
    }

    displayMovies(apiURL);
});

function viewingTrending () {
    if (currentInput.trim() === "")
        return true;
    else 
        return false;
}

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
        movieID: [],
        movieNames: [],
        moviePosters: [],
        movieRatings: []
    }

    responseData.results.forEach((element) => {
        movieInformation.movieID.push(element.id);
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
    console.log(page)
    document.querySelector(`.grid-container-${page}`).innerHTML += `
        <div class="grid-item">
            <div class="movie-container">
                <img class="movie-image-${page}" src="https://image.tmdb.org/t/p/original/${moviePoster}" alt="Poster image of ${movieName}">
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
function loadMoviesToPage({movieNames, moviePosters, movieRatings}) {

    let div = document.createElement("div");
    div.className = `grid-container grid-container-${page}`
    movieArea.appendChild(div);

    movieNames.forEach((element, index) => {
        addMovieToPage(element, moviePosters[index], movieRatings[index]);
    });
}

/**
 * Loads currently trending movies to the page
 */
function loadTrendingMovies() {
    currentPage.innerHTML = "Trending"
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
    const movieInformation = getMovieData(responseData);
    loadMoviesToPage(movieInformation);

    const movieImages = document.querySelectorAll(".movie-image-" + page);
    
    console.log()
    movieImages.forEach((element, index) => {
        element.addEventListener("click", (evt) => {
            const movieURL = `https://api.themoviedb.org/3/movie/${movieInformation.movieID[index]}?api_key=e34b1cb04a474e9600a7d1c5ef07069f&language=en-US`;
            displayPopup(movieURL, movieInformation.movieNames[index], movieInformation.moviePosters[index], movieInformation.movieRatings[index]);
        });
    })
}

async function displayPopup (movieURL, movieName, moviePoster, movieRating) {
    const movieData = await getResponse(movieURL);
    // console.log(movieData);
    
    const movieOverview = movieData.overview;
    const movieReleaseDate = movieData.release_date;
    const movieBackDropPath = movieData.backdrop_path;
    const movieRuntime = movieData.runtime;
    const movieGenre = movieData.genres.map(x => " " + x.name.toUpperCase());

    const popUpContainer = document.querySelector(".popUp-container");

    popUpContainer.classList.add("popUp-visible");
    popUpContainer.innerHTML += `
        <div id="popUp" class="centered">
            <button id="closeBtn" alt="close pop up">X</button>
            <img class="popUp-grid-item" id="popupBackDropImg" src="https://image.tmdb.org/t/p/original/${movieBackDropPath}">
            <img class="popUp-grid-item" id="popupPosterImg" src="https://image.tmdb.org/t/p/original/${moviePoster}">
            <div class="popUp-grid-item" id="popupInfo">
                <p id="movieGenre">${movieGenre}</p>
                <p id="movieName">${movieName}</p>
                <div id="movieInformation">
                    <p id="movieTime">${movieRuntime} min | ${movieReleaseDate}</p>
                    <p id="movieRating">${movieRating} &#11088</p>
                </div>
            </div>
            <div class="popUp-grid-item" id="popupOverview">${movieOverview}</div>
        </div>
     `;

    const closeBtn = document.querySelector("#closeBtn");
    closeBtn.addEventListener("click", (evt) => {
        closePopup(popUpContainer);
    });
}

function closePopup (popUpContainer) {
    popUpContainer.classList.remove("popUp-visible");
    popUpContainer.innerHTML = "";
}

window.onload = onloadFunc;
async function onloadFunc () {

    loadTrendingMovies();
}