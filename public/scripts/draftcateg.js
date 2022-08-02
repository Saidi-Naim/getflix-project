
//je veux appuyer sur action et afficher tous les film qui ont pour genre action. et avoir plusieurs pages. Donc au lieu d'avoir plusieurs div avoir une qui s'affiche onclick.


let api_key = "860299d08527b54489820acbf28e4486";
let img_url = "https://image.tmdb.org/t/p/w500";
let original_img_url = "https://image.tmdb.org/t/p/original";
let genres_list_http = "https://api.themoviedb.org/3/genre/movie/list?";
let movie_genres_http = "https://api.themoviedb.org/3/movie/popular?";
let movie_detail_http = "https://api.themoviedb.org/3/movie";

const main = document.querySelector('.main');

fetch(genres_list_http + new URLSearchParams({
    api_key: api_key,
    include_adult: false
}))
.then(res => res.json())
.then(data => {
    data.genres.forEach(item => {
        fetchMoviesListByGenres(item.id, item.name);
    })
    console.log(data);
});

const fetchMoviesListByGenres = (id, genres) => {
    fetch(movie_genres_http + new URLSearchParams({
        api_key: api_key,
        with_genres: id,
        page: 1,
        include_adult: false
    }))
    .then(res => res.json())
    .then(data => {
        makeCategoryElement(`${genres}_movies`, data.results); console.log(data);
    })
    .catch(err =>  console.log(err));
}
function genreCatalogueClick(){
    //window.location.href="/search";
   const aBtnDropdown= document.querySelectorAll('.aBtnDropdown');
   aBtnDropdown.forEach(btn => {
    btn.setAttribute('href','/catalogue');
   })
  if((aBtnDropdown.innerHTML + "Movies")==(category.split("_").join(" "))){
    const movielist=document.querySelectorAll('.movie-list');
    movielist.style.display=visible;
  }
  else{
    const movielist=document.querySelectorAll('.movie-list');
    movielist.style.display=none;
  }
}
const makeCategoryElement = (category, data) => {
    main.innerHTML += `
    <div class="movie-list">
       
        <h1 class="movie-category">${category.split("_").join(" ")}</h1>
        <div class="movie-container" id="${category}">
        </div>
        
    </div>
    `;
    makeCards(category, data);
}

const makeCards = (id, data) => {
    const movieContainer = document.getElementById(id);
    data.forEach(item => {
        const {title, poster_path, vote_average, id} = item;

        movieContainer.innerHTML += `
        <div class="movie" onclick="location.href = '/${id}'">
        <img src="${poster_path? img_url+poster_path: "http://via.placeholder.com/200x300"}" alt="${title}">
            <div class="overview">
                <h3><b>${title}</b></h3>
                <span class="scoreAverage">Rated: ${vote_average}</span>
                
                <br/> 
                <button class="know-more" id="${id}">More Info</button>
            </div>
        </div>
        `;
    })
}
/*
        <div class="movie" onclick="location.href = '/${item.id}'">
            <img src="${img_url}${item.backdrop_path}" alt="">
            <p class="movie-title">${item.title}</p>
        </div>
*/