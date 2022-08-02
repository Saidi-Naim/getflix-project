const API_KEY = 'api_key=860299d08527b54489820acbf28e4486';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URLPopular = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY+'&include_adult=false';
let img_url = "https://image.tmdb.org/t/p/w500";
let original_img_url = "https://image.tmdb.org/t/p/original";
//let genres_list_http = BASE_URL+ "/genre/movie/list?";
//let movie_detail_http = "https://api.themoviedb.org/3/movie";
const GenreBtnEl = document.getElementById('GenreBtn');

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
//console.log(genres[0].name)
const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')
var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100; 


const main = document.querySelector('.main');
const movieCard = document.getElementById('movieCard');
const aBtnDropdown= [...document.querySelectorAll('.aBtnDropdown')];
const ActionBtn=document.getElementById('ActionM');

searchbox.addEventListener('submit', (e) => {
  e.preventDefault();
  window.location.href="/search?search="+search.value;
  
})


getMovies(API_URLPopular);

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
             <img src="${poster_path? img_url+poster_path: "http://via.placeholder.com/150x150" }" alt="${title}">
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

  //select genre:

aBtnDropdown.forEach(btn =>{
  btn.addEventListener('click', ()=>{
    GenreBtnEl.innerHTML= '';
    //genres.forEach(genre => {
     // if(genre.name = btn.innerHTML){
        
                const title = document.createElement('h3');
                title.classList.add('genreTitle');
                //title.id=genre.id;
                title.innerText = btn.innerHTML;
                for(let genre of genres){
                    if(genre.name==btn.innerHTML){
                      console.log(genres[0].name);
                      console.log(btn.innerText);
                    const idBtn=genre.id;
                    
                    getMovies(API_URLPopular + '&with_genres='+encodeURI(idBtn));
                    GenreBtnEl.append(title);
                    }
                }       
     // }
   // })
  })
})
  /*aBtnDropdown[0].addEventListener('click', ()=>{
      GenreBtnEl.innerHTML= '';
                  const title = document.createElement('h3');
                  title.classList.add('genreTitle');
                  title.id="28";
                  title.innerText = "Action Movies";
                      getMovies(API_URLPopular + '&with_genres='+encodeURI("28"));
                      GenreBtnEl.append(title);
  })

  aBtnDropdown[1].addEventListener('click', ()=>{
    GenreBtnEl.innerHTML= '';
                const title = document.createElement('h3');
                title.classList.add('genreTitle');
                title.id="12";
                title.innerText = "Adventure Movies";
                    getMovies(API_URLPopular + '&with_genres='+encodeURI("12"));
                    GenreBtnEl.append(title);
})

aBtnDropdown[2].addEventListener('click', ()=>{
  GenreBtnEl.innerHTML= '';
              const title = document.createElement('h3');
              title.classList.add('genreTitle');
              title.id="16";
              title.innerText = "Animation Movies";
                  getMovies(API_URLPopular + '&with_genres='+encodeURI("16"));
                  GenreBtnEl.append(title);
})
aBtnDropdown[3].addEventListener('click', ()=>{
  GenreBtnEl.innerHTML= '';
              const title = document.createElement('h3');
              title.classList.add('genreTitle');
              title.id="35";
              title.innerText = "Comedy Movies";
                  getMovies(API_URLPopular + '&with_genres='+encodeURI("35"));
                  GenreBtnEl.append(title);
})
aBtnDropdown[4].addEventListener('click', ()=>{
  GenreBtnEl.innerHTML= '';
              const title = document.createElement('h3');
              title.classList.add('genreTitle');
              title.id="80";
              title.innerText = "Crime Movies";
                  getMovies(API_URLPopular + '&with_genres='+encodeURI("80"));
                  GenreBtnEl.append(title);
})
aBtnDropdown[5].addEventListener('click', ()=>{
  GenreBtnEl.innerHTML= '';
              const title = document.createElement('h3');
              title.classList.add('genreTitle');
              title.id="99";
              title.innerText = "Documentary Movies";
                  getMovies(API_URLPopular + '&with_genres='+encodeURI("99"));
                  GenreBtnEl.append(title);
})
aBtnDropdown[6].addEventListener('click', ()=>{
  GenreBtnEl.innerHTML= '';
              const title = document.createElement('h3');
              title.classList.add('genreTitle');
              title.id="18";
              title.innerText = "Drama Movies";
                  getMovies(API_URLPopular + '&with_genres='+encodeURI("18"));
                  GenreBtnEl.append(title);
})
aBtnDropdown[7].addEventListener('click', ()=>{
  GenreBtnEl.innerHTML= '';
              const title = document.createElement('h3');
              title.classList.add('genreTitle');
              title.id="10751";
              title.innerText = "Family Movies";
                  getMovies(API_URLPopular + '&with_genres='+encodeURI("10751"));
                  GenreBtnEl.append(title);
})
aBtnDropdown[8].addEventListener('click', ()=>{
  GenreBtnEl.innerHTML= '';
              const title = document.createElement('h3');
              title.classList.add('genreTitle');
              title.id="14";
              title.innerText = "Fantasy Movies";
                  getMovies(API_URLPopular + '&with_genres='+encodeURI("14"));
                  GenreBtnEl.append(title);
})
aBtnDropdown[9].addEventListener('click', ()=>{
  GenreBtnEl.innerHTML= '';
              const title = document.createElement('h3');
              title.classList.add('genreTitle');
              title.id="36";
              title.innerText = "History Movies";
                  getMovies(API_URLPopular + '&with_genres='+encodeURI("36"));
                  GenreBtnEl.append(title);
})
aBtnDropdown[10].addEventListener('click', ()=>{
  GenreBtnEl.innerHTML= '';
              const title = document.createElement('h3');
              title.classList.add('genreTitle');
              title.id="27";
              title.innerText = "Horror Movies";
                  getMovies(API_URLPopular + '&with_genres='+encodeURI("27"));
                  GenreBtnEl.append(title);
})
aBtnDropdown[11].addEventListener('click', ()=>{
  GenreBtnEl.innerHTML= '';
              const title = document.createElement('h3');
              title.classList.add('genreTitle');
              title.id="10402";
              title.innerText = "Music Movies";
                  getMovies(API_URLPopular + '&with_genres='+encodeURI("10402"));
                  GenreBtnEl.append(title);
})
aBtnDropdown[12].addEventListener('click', ()=>{
  GenreBtnEl.innerHTML= '';
              const title = document.createElement('h3');
              title.classList.add('genreTitle');
              title.id="9648";
              title.innerText = "Mystery Movies";
                  getMovies(API_URLPopular + '&with_genres='+encodeURI("9648"));
                  GenreBtnEl.append(title);
})
aBtnDropdown[13].addEventListener('click', ()=>{
  GenreBtnEl.innerHTML= '';
              const title = document.createElement('h3');
              title.classList.add('genreTitle');
              title.id="10749";
              title.innerText = "Romance Movies";
                  getMovies(API_URLPopular + '&with_genres='+encodeURI("10749"));
                  GenreBtnEl.append(title);
})
aBtnDropdown[14].addEventListener('click', ()=>{
  GenreBtnEl.innerHTML= '';
              const title = document.createElement('h3');
              title.classList.add('genreTitle');
              title.id="878";
              title.innerText = "Science Fiction Movies";
                  getMovies(API_URLPopular + '&with_genres='+encodeURI("878"));
                  GenreBtnEl.append(title);
})
aBtnDropdown[15].addEventListener('click', ()=>{
  GenreBtnEl.innerHTML= '';
              const title = document.createElement('h3');
              title.classList.add('genreTitle');
              title.id="10770";
              title.innerText = "TV Movies";
                  getMovies(API_URLPopular + '&with_genres='+encodeURI("10770"));
                  GenreBtnEl.append(title);
})
aBtnDropdown[16].addEventListener('click', ()=>{
  GenreBtnEl.innerHTML= '';
              const title = document.createElement('h3');
              title.classList.add('genreTitle');
              title.id="53";
              title.innerText = "Thriller Movies";
                  getMovies(API_URLPopular + '&with_genres='+encodeURI("53"));
                  GenreBtnEl.append(title);
})
aBtnDropdown[17].addEventListener('click', ()=>{
  GenreBtnEl.innerHTML= '';
              const title = document.createElement('h3');
              title.classList.add('genreTitle');
              title.id="10752";
              title.innerText = "War Movies";
                  getMovies(API_URLPopular + '&with_genres='+encodeURI("10752"));
                  GenreBtnEl.append(title);
})
aBtnDropdown[18].addEventListener('click', ()=>{
  GenreBtnEl.innerHTML= '';
              const title = document.createElement('h3');
              title.classList.add('genreTitle');
              title.id="37";
              title.innerText = "Western Movies";
                  getMovies(API_URLPopular + '&with_genres='+encodeURI("37"));
                  GenreBtnEl.append(title);
}) */

