const API_KEY = 'api_key=860299d08527b54489820acbf28e4486';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URLPopular = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const API_URLTopRated = BASE_URL + '/movie/top_rated?'+API_KEY+'&language=en-US';
const API_URLLatest=BASE_URL + '/tv/airing_today?'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w342';
const searchURL = BASE_URL + '/search/multi?'+API_KEY+'&query='+'&language=en-US&page=1&include_adult=false';
const trending=document.getElementById("trending");
const movieTop10=document.getElementById("movieTop10");
const latestmovies=document.getElementById("latestmovies");
const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]

// Search bar:
function search(url) {
  lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        searchSubmit(data.results);
    })

}
function searchSubmit(){

}

getPopularMovies(API_URLPopular);
getTopRatedMovies(API_URLTopRated);
getLatestMovies(API_URLLatest);

function getPopularMovies(url) {
  lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        showPopularMovies(data.results);
    })

}


function showPopularMovies(data) {
  trending.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview, id} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
             <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">
            <div class="movie-info">
                <h3><b>${title}</b></h3>
                <span class="scoreAverage">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
                <br/> 
                <button class="know-more" id="${id}">Know More</button>
            </div>`;

            trending.appendChild(movieEl);

        document.getElementById(id).addEventListener('click', () => {
          console.log(id);
          openNav(movie);
        })
    })
}
function getTopRatedMovies(url) {
  lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        showTopRatedMovies(data.results);
    })

}


function showTopRatedMovies(data) {
  movieTop10.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview, id} = movie;
        
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
             <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">
            <div class="movie-info">
                <h3><b>${title}</b></h3>
                <span class="scoreAverage">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
                <br/> 
                <button class="know-more" id="${id}">Know More</button>
            </div>`;

            movieTop10.appendChild(movieEl);

        document.getElementById(id).addEventListener('click', () => {
          console.log(id);
          openNav(movie);
        })
    })
}



//console.log(searchURL);
function getLatestMovies(url) {
  lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        showLatestMovies(data.results);
    })

}

function showLatestMovies(data) {
  latestmovies.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview, id} = movie;
        
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
             <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">
            <div class="movie-info">
                <h3><b>${title}</b></h3>
                <span class="scoreAverage">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
                <br/> 
                <button class="know-more" id="${id}">Know More</button>
            </div>`;

            latestmovies.appendChild(movieEl);

        document.getElementById(id).addEventListener('click', () => {
          console.log(id);
          openNav(movie);

        })
    })
}