const API_KEY = "e34b1cb04a474e9600a7d1c5ef07069f";

const searchForm = document.querySelector("#searchForm");
const searchBtn = document.querySelector("#searchBtn");
const movieArea = document.querySelector(".grid-container");
const loadMoreBtn = document.querySelector("#loadMoreBtn");

let timeWindow = "week";
let mediaType = "movie";
let page = 1;


searchForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    //1. Get user input
    const userInput = evt.target.input.value;

    //2. Search for specified Movie
    const apiURL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;
    //const apiURL = "https://api.themoviedb.org/3/search/movie?api_key="+apiKey+"&language=en-US&query="+input+"&page=1&include_adult=false"
    const responseData = await getResponse(apiURL);


    //3. Get movie details
})



async function getResponse(targetURL) {
    const respone = await fetch(targetURL);
    const responseData = await respone.json();
    return responseData;
}

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

window.onload = onloadFunc;
async function onloadFunc () {
    //1. Search Api for movies
        const apiURL = `https://api.themoviedb.org/3/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}&page=${page}`
        const responseData = await getResponse(apiURL);
        
        console.log(responseData.results[0]);
        movieInformation = getMovieData(responseData);

        //2. Display movies
    }