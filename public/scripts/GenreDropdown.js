
const ApiUrlMovies = BASE_URL + '/genre/movie/list?'+API_KEY+'&include_adult=false';
const GenreDropdown=document.getElementById("GenreDropdown");
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
          const genreEl = document.createElement('a');
          genreEl.setAttribute('id','${id}');
          genreEl.setAttribute('href','#');
          genreEl.innerHTML = `${name}`;
        
        GenreDropdown.appendChild(genreEl);
              
      })
  }