//https://www.geeksforgeeks.org/how-to-display-search-result-of-another-page-on-same-page-using-ajax-in-jsp/
const API_KEY = 'api_key=860299d08527b54489820acbf28e4486';
const BASE_URL = 'https://api.themoviedb.org/3';
const ApiUrlShows = BASE_URL + '/discover/tv?sort_by=popularity.desc&'+API_KEY+'&include_adult=false';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/multi?'+API_KEY;

const genres = [
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
      "id": 36,
      "name": "History"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
        "id": 10763,
        "name": "News"
      },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 37,
      "name": "Western"
    },
    {
      "id": 10759,
      "name": "Action & Adventure"
    },
    {
      "id": 10762,
      "name": "Kids"
    },
    {
      "id": 10765,
      "name": "Sci-Fi & Fantasy"
    },
    {
      "id": 10766,
      "name": "Soap"
    },
    {
      "id": 10767,
      "name": "Talk"
    },
    {
      "id": 10768,
      "name": "War & Politics"
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
            getMovies(ApiUrlShows + '&with_genres='+encodeURI(selectedGenre.join(',')));
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
            getMovies(ApiUrlShows);
        })
        GenreBtnEl.append(clear);
    }
    
}

getMovies(ApiUrlShows);

function getMovies(url) {
  lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        if(data.results.length !== 0){
            ShowsCard(data.results);
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

function ShowsCard(data) {
  movieCard.innerHTML = '';

  data.forEach(movie => {
      const {name, poster_path, vote_average, id} = movie;
      const movieEl = document.createElement('div');
      movieEl.classList.add('movie');
      movieEl.innerHTML = `
           <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${name}">

          <div class="movie-info">
              <h3>${name}</h3>
              <span class="rate">${vote_average}</span>
          </div>
          <div class="overview">
                <button class="know-more" id="${id}">Know More</button>
            </div>`

      movieCard.appendChild(movieEl);
      
  })
}


form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    selectedGenre=[];
    setGenre();
    if(searchTerm) {
        getMovies(searchURL+'&query='+searchTerm)
    }else{
        getMovies(ApiUrlShows);
    }

})

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