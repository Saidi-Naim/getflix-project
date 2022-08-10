//https://www.geeksforgeeks.org/how-to-display-search-result-of-another-page-on-same-page-using-ajax-in-jsp/
const API_KEY = 'api_key=860299d08527b54489820acbf28e4486';
const BASE_URL = 'https://api.themoviedb.org/3';
const ApiUrlMovies = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY+'&include_adult=false';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY+'&language=en-US&include_adult=false';



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
//
const movieCard = document.getElementById('movieCard');
const form =  document.getElementById('form');
const search = document.getElementById('search');
const GenreBtnEl = document.getElementById('GenreBtn');

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;
/// Pour lier recherche de page index à search
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

console.log(urlParams.get("search"));
////
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
        const {title, poster_path, vote_average,overview, id} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
             <img src="${
               poster_path
                 ? IMG_URL + poster_path
                 : "http://via.placeholder.com/150x150"
             }" alt="${title}">
             <div class="modal-comments modal-comments-hidden" id="comments${id}">
             <i class="fa-solid fa-xmark"></i>
             <div class="comments">
               <h1>${title}</h1>
               <div id="video"></div>
               <p>${overview}</p>
             </div>
           </div>
            <div class="overview">
            <h3><b>${title}</b></h3>
                <span class="scoreAverage">Rated: ${vote_average}</span>
                <button class="know-more" id="${id}" title="${title}" description="${overview}">More Info</button>
            </div>`;

        movieCard.appendChild(movieEl);
        [...document.querySelectorAll('.know-more')].forEach(el => {
          document.getElementById('comments'+el.getAttribute('id')).querySelector('.fa-xmark').addEventListener('click',()=>{
            document.getElementById('comments'+el.getAttribute('id')).classList.add('modal-comments-hidden');
            //getVideos(movie);
          });
          el.addEventListener('click', ()=>{
            //console.log('r');
            document.getElementById('comments'+el.getAttribute('id')).classList.remove('modal-comments-hidden');
            getVideos(movie);
          })
        })
    });
    
}

function getVideos(movie) {
  let id=movie.id;
  fetch('https://api.themoviedb.org/3/' + 'movie/'+id+'/videos?' + 'api_key=860299d08527b54489820acbf28e4486' +'&language=en-US')
  .then(res => res.json()).then(videoData => {
    const trailer=document.getElementById("video");
      //console.log(videoData);
      //showVideos(data.results);
      if(videoData){
        //trailer.style.width = "100%";
        if(videoData.results.length>0){
          videoData.results.forEach((video) => {
            let {name, key, site} = video
  //console.log( movie.title);
  //console.log(name);
  //let title=movie.title;
  /*if( name == title){
    console.log("ok")
  }*/
  console.log(typeof name, typeof movie.title);
            if(site == 'YouTube'){
              
              trailer.innerHTML = "";
                const videoEl = document.createElement("div");
                videoEl.classList.add("movieTrailer");
                  videoEl.innerHTML = `
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                `
              
                trailer.appendChild(videoEl);
              
            }
            else{
                trailer.innerHTML = `<h1 class="no-results">No Results Found</h1>`
              }
            
          })
      }
    }
    });
}

/*function showVideos(data) {
  const video=document.getElementById("video");
  video.innerHTML = "";

  data.forEach((video) => {
    const { name, key, site, id } = video;
    const videoEl = document.createElement("div");
    videoEl.classList.add("movieTrailer");
    
    if(site == 'Youtube'){
      videoEl.innerHTML = `
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `
  }
  else{
    videoEl.innerHTML = `
        <p>No Trailer available</p>
    `;
  }
    video.appendChild(videoEl);
  }); 
}*/


//////////////////////////////////////
/////////////////////////////////////
if (urlParams.get("search") != null) {
  //console.log('r');
  getMovies(searchURL + "&query=" + urlParams.get("search"));
}else{
  getMovies(ApiUrlMovies);
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  window.location.href="/search?search="+search.value;
  const searchTerm = search.value;
  selectedGenre=[];
  setGenre();
  if(searchTerm) {
      getMovies(searchURL+'&query='+searchTerm)
  }else{
      getMovies(ApiUrlMovies);
  }
});

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