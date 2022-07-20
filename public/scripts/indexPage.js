const API_KEY = 'api_key=860299d08527b54489820acbf28e4486';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URLPopular = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const API_URLTopRated = BASE_URL + '/movie/top_rated?'+API_KEY+'&language=en-US';
const API_URLLatest=BASE_URL + '/movie/now_playing?'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w342';
const ApiUrlMovies = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY+'&include_adult=false';
const searchURL = BASE_URL + '/search/movie?'+API_KEY+'&language=en-US&include_adult=false';
const trending=document.getElementById("trending");
const movieTop10=document.getElementById("movieTop10");
const latestmovies=document.getElementById("latestmovies");
const searchbox=document.getElementById("searchbox");
const ApiUrlMoviesGenres = BASE_URL + '/genre/movie/list?'+API_KEY+'&include_adult=false';
const GenreDropdown=document.getElementById("sub_menu");
const form =  document.getElementById('searchbox');
const body = document.getElementsByTagName("body");
const footer = document.getElementsByTagName("footer");
/// variables for search and filtre:


var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;

//////////Genre Dropdown menu:
fetchGenres(ApiUrlMoviesGenres); 
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
          genreEl.setAttribute('id', "LiSecondlevel")
          genreEl.innerHTML = `<a href="" id="${name}">${name}</a>`;
        
        GenreDropdown.appendChild(genreEl);
          
      })
  }

///submit search keyword:

form.addEventListener('submit', (e) => {
    e.preventDefault();
    //window.location.href="/";
    document.getElementById('home').style.display="none";
    const MovieBox = document.createElement('div');
    MovieBox.classList.add('MovieBox');
    MovieBox.innerHTML=
    `<div id='GenreBtn'></div>
      <main id='movieCard'></main>
    <div class='pagination'>
        <div class='page' id='prev'>Previous Page</div>
        <div class='current' id='current'>1</div>
        <div class='page' id='next'>Next Page</div>
    </div>`;
    body.appendChild(MovieBox);
    const searchTerm = search.value;
    selectedGenre=[];
    setGenre();
    if(searchTerm) {
        getMovies(searchURL+'&query='+searchTerm)
    }else{
        getMovies(ApiUrlMovies);
    }
}) 

/// variables for search and filtre:
const movieCard = document.getElementById('movieCard');

const search = document.getElementById('search');
const GenreBtnEl = document.getElementById('GenreBtn');

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

//Search script////////////
var selectedGenre = []
setGenre();
function setGenre() {
    GenreBtnEl.innerHTML= '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx, 1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre);
            getMovies(ApiUrlMovies + '&with_genres='+encodeURI(selectedGenre.join(',')));
            highlightSelection();
        })
        GenreBtnEl.append(t);
    })
}

function highlightSelection() {
    const GenreBtnS = document.querySelectorAll('.tag');
    GenreBtnS.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn()
    if(selectedGenre.length !=0){   
        selectedGenre.forEach(id => {
            const hightlightedTag = document.getElementById(id);
            hightlightedTag.classList.add('highlight');
        })
    }

}

function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight')
    }else{
            
        let clear = document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear x';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();            
            getMovies(ApiUrlMovies);
        })
        GenreBtnEl.append(clear);
    }
    
}

getMovies(ApiUrlMovies);

function getMovies(url) {
  lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        if(data.results.length !== 0){
            showMovies(data.results);
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

            GenreBtnEl.scrollIntoView({behavior : 'smooth'})

        }else{
            movieCard.innerHTML= `<h1 class="no-results">No Results Found</h1>`
        }
       
    })

}
function showMovies(data) {
    movieCard.innerHTML = '';

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

        movieCard.appendChild(movieEl);
    
        document.getElementById(id).addEventListener('click', () => {
          console.log(id);
          openNav(movie);
        })
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
      let url = lastUrl + '&page='+page
      getMovies(url);
    }else{
      key[1] = page.toString();
      let a = key.join('=');
      queryParams[queryParams.length -1] = a;
      let b = queryParams.join('&');
      let url = urlSplit[0] +'?'+ b
      getMovies(url);
    }
  }