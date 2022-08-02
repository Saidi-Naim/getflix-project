
//je veux appuyer sur action et afficher tous les film qui ont pour genre action. et avoir plusieurs pages. Donc au lieu d'avoir plusieurs div avoir une qui s'affiche onclick.


let api_key = "860299d08527b54489820acbf28e4486";
let img_url = "https://image.tmdb.org/t/p/w500";
let original_img_url = "https://image.tmdb.org/t/p/original";
let genres_list_http = "https://api.themoviedb.org/3/genre/movie/list?";
let movie_genres_http = "https://api.themoviedb.org/3/movie/popular?";
let movie_detail_http = "https://api.themoviedb.org/3/movie";


const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')
var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;


const main = document.querySelector('.main');
/*const aBtnDropdown= document.querySelectorAll('.aBtnDropdown');
var test=[].map.call(document.querySelectorAll('.aBtnDropdown'), function(el) {
    return el.innerHTML;
}).join();
console.log(aBtnDropdown[0].innerHTML);*/

function genreCatalogueClick(){
    //window.location.href="/search";
   const aBtnDropdown= document.querySelectorAll('.aBtnDropdown');
   aBtnDropdown.forEach(btn => {
    btn.setAttribute('href','/catalogue');
    //console.log(aBtnDropdown.innerHTML);
   })
  if((aBtnDropdown[0].innerHTML)== "Action"){
   
  }
  /*else{
    const movielist=document.querySelectorAll('.movie-list');
    movielist.style.display=none;
  }*/
}
/*var test=[].map.call(document.querySelectorAll('.aBtnDropdown'), function(el) {
    return el.innerHTML;
}).join();
console.log(aBtnDropdown[0].innerHTML);*/

/*function genreCatalogueClick(){
    //window.location.href="/search";
   const aBtnDropdown= document.querySelectorAll('.aBtnDropdown');
   aBtnDropdown.forEach(btn => {
    btn.setAttribute('href','/catalogue');
    //console.log(aBtnDropdown.innerHTML);
   })
  if((aBtnDropdown[0].innerHTML)== "Action"){
   
  }
  /*else{
    const movielist=document.querySelectorAll('.movie-list');
    movielist.style.display=none;
  }*/
//}

fetch(genres_list_http + new URLSearchParams({
    api_key: api_key,
    include_adult: false
}))
.then(res => res.json())
.then(data => {
    console.log(data.genres[0].id);
    fetchMoviesListByGenres(data.genres[0].id, data.genres[0].name);

    
});
const fetchMoviesListByGenres = (id, genres) => {
    lastUrl=movie_genres_http + new URLSearchParams({
        api_key: api_key,
        with_genres: id,
        include_adult: false,
        page:1
    });
    fetch(movie_genres_http + new URLSearchParams({
        api_key: api_key,
        with_genres: id,
        include_adult: false,
        page:1
    }))
    .then(res => res.json())
    .then(data => {
        console.log(data.results[0].genre_ids);
        if(data.results.length !== 0){
            makeCategoryElement(`${genres}`, data.results); 
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage;

            if(currentPage <= 1){
              prev.classList.add('disabled');
              next.classList.remove('disabled')
            }else if(currentPage>= totalPages){
              prev.classList.remove('disabled');
              next.classList.add('disabled')
            }else{
              prev.classList.remove('disabled');
              next.classList.remove('disabled')
            }
        }else{
            movieCard.innerHTML= `<h1 class="no-results">No Results Found</h1>`
        }


    })
    .catch(err =>  console.log(err));
}
const makeCategoryElement = (category, data) => {
    main.innerHTML += `
    <div class="movie-list">
       
        <h1 class="movie-category">${category}</h1>
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


prev.addEventListener('click', () => {
    if(prevPage > 0){
      pageCall(prevPage);
    }
  })
  
  next.addEventListener('click', () => {
    if(nextPage <= totalPages){
      pageCall(nextPage);
    }
  })

  function pageCall(page){
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length -1].split('=');
    if(key[0] != 'page'){
      let url = movie_genres_http + new URLSearchParams({
        api_key: api_key,
        with_genres: id,
        include_adult: false, 
        page: +page
      })
      fetchMoviesListByGenres(data.genres[0].id, genres);
    }else{
      key[1] = page.toString();
      let a = key.join('=');
      queryParams[queryParams.length -1] = a;
      let b = queryParams.join('&');
      let url = urlSplit[0] +'?'+ b
      fetchMoviesListByGenres(data.genres[0].id, genres);
    }
  }