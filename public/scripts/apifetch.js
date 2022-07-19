const API_KEY = 'api_key=860299d08527b54489820acbf28e4486';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URLPopular = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const API_URLTopRated = BASE_URL + '/movie/top_rated?'+API_KEY+'&language=en-US';
const API_URLLatest=BASE_URL + '/movie/now_playing?'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w342';
const trending=document.getElementById("trending");
const movieTop10=document.getElementById("movieTop10");
const latestmovies=document.getElementById("latestmovies");
const searchbox=document.getElementById("searchbox");
const ApiUrlMovies = BASE_URL + '/genre/movie/list?'+API_KEY+'&include_adult=false';
const GenreDropdown=document.getElementById("sub_menu");

//Genre Dropdown menu:
fetchGenres(ApiUrlMovies); //https://stackoverflow.com/questions/45974412/is-it-possible-to-create-a-drop-down-with-multiple-columns-like-mega-menu-usin
function fetchGenres(url) {
    lastUrl = url;
      fetch(url).then(res => res.json()).then(data => {
          console.log(data.genres)
          listGenres(data.genres);
      })
  
}
function listGenres(data) {
    GenreDropdown.innerHTML = '';
  
      data.forEach(genre => {
          const {id, name} = genre;
          const genreEl = document.createElement('li');
          genreEl.setAttribute('id', "LiSecondlevel");
          genreEl.classList.add('sub_menu_li_hidden')
          genreEl.innerHTML = `<a href="" id="${name}">${name}</a>`;
        
        GenreDropdown.appendChild(genreEl);
          
      })
  }
//Search:
searchbox.addEventListener('submit', (e) => {
  window.location.href="/search";
  e.preventDefault();
  const searchTerm = search.value;
  selectedGenre=[];
  setGenre();
  if(searchTerm) {
      getMovies(searchURL+'&query='+searchTerm)
  }else{
      getMovies(ApiUrlMovies);
  }

}) 

//scroll:
/*const setupScrolling = () => {
  
      let containerDimensions = trending.getBoundingClientRect();
      let containerWidth = containerDimensions.width;

      nxtBtn.addEventListener('click', () => {
        trending.scrollLeft += containerWidth;
      })

      preBtn.addEventListener('click', () => {
        trending.scrollLeft -= containerWidth;
      })
  
  movieTop10.forEach((item) => {
    let containerDimensions = item.getBoundingClientRect();
    let containerWidth = containerDimensions.width;

    nxtBtn.addEventListener('click', () => {
        item.scrollLeft += containerWidth;
    })

    preBtn.addEventListener('click', () => {
        item.scrollLeft -= containerWidth;
    })
})
airingShows.forEach((item) => {
  let containerDimensions = item.getBoundingClientRect();
  let containerWidth = containerDimensions.width;

  nxtBtn.addEventListener('click', () => {
      item.scrollLeft += containerWidth;
  })

  preBtn.addEventListener('click', () => {
      item.scrollLeft -= containerWidth;
  })
})
}*/

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
        const {title, poster_path, vote_average, id} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
             <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/150x150" }" alt="${title}">
            <div class="overview">
                <h3><b>${title}</b></h3>
                <span class="scoreAverage">Rated: ${vote_average}</span>
                
                <br/> 
                <button class="know-more" id="${id}">More Info</button>
            </div>`;

            trending.appendChild(movieEl);
            /*if(movie == data.length - 1){
              setTimeout(() => {
                  setupScrolling();
              }, 100);
          } */
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
        const {title, poster_path, vote_average, id} = movie;
        
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
             <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/150x150" }" alt="${title}">
            <div class="overview">
                <h3><b>${title}</b></h3>
                <span class="scoreAverage">Rated: ${vote_average}</span>
                <br/> 
                <button class="know-more" id="${id}">More Info</button>
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
        const {title, poster_path, vote_average, id} = movie;
        
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
             <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/150x150" }" alt="${title}">
          
            <div class="overview">
                <h3><b>${title}</b></h3>
                <span class="scoreAverage">Rated: ${vote_average}</span>
                <br/> 
                <button class="know-more" id="${id}">More Info</button>
            </div>`;

            latestmovies.appendChild(movieEl);

        document.getElementById(id).addEventListener('click', () => {
          console.log(id);
          openNav(movie);

        })
    })
}