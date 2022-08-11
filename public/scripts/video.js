const API_KEY = 'api_key=860299d08527b54489820acbf28e4486';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const ApiUrlMovies = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY+'&include_adult=false';
const movieCard = document.getElementById('movieCard');

getMovies(ApiUrlMovies);

function getMovies(url) {
  
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        if(data.results.length !== 0){
            showMovies(data.results);

        }else{
            movieCard.innerHTML= `<h1 class="no-results">No Results Found</h1>`
        }
       
    })

}
function showMovies(data) {
    movieCard.innerHTML = '';
   
    data.forEach(movie => {
        //const {title, poster_path, vote_average,overview, id} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
        <div id="video">${getVideos(movie)}</div>`;

        movieCard.appendChild(movieEl);
        getVideos(movie);
    });
    
}


const trailer=document.getElementById("video");
function getVideos(movie) {
  let id=movie.id;
  fetch(BASE_URL + '/movie/'+id+'/videos?' + API_KEY)
  .then(res => res.json()).then(videoData => {
      console.log(videoData);
      showVideos(videoData.results);
    }).catch(function(error) {
        console.log(error);
      });
}



/*getVideos(movie);
function getVideos(movie) {
    let id=movie.id;
    fetch(BASE_URL + 'movie/'+id+'/videos?' + API_KEY +'&language=en-US')
      .then((res) => res.json())
      .then((data) => {
        console.log(data.results);
        showVideos(data.results);
        
      });
  }*/

  function showVideos(videoData) {
   //showVideos(data.results);
   if(videoData){
    trailer.style.width = "100%";
    if(videoData.results.length>0){
      videoData.results.forEach((video) => {
        let {name, key, site} = video

        if(site == 'YouTube' ){
          
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
    
  }

  /*let id=movie.id;
  fetch('https://api.themoviedb.org/3/' + 'movie/'+id+'/videos?' + 'api_key=860299d08527b54489820acbf28e4486' +'&language=en-US')
  .then(res => res.json()).then(TrailerData => {
    const trailer=document.getElementById("video");
      //console.log(TrailerData);
      //showVideos(data.results);
      if(TrailerData){
        //trailer.style.width = "100%";
        if(TrailerData.results.length>0){
          TrailerData.results.forEach((video) => {
            let {name, key, site} = video
  
            if(site == 'YouTube'){
              
             
                if(idBTN == id){
                  //trailer.innerHTML = "";
                  const videoEl = document.createElement("div");
                  videoEl.classList.add("movieTrailer");
                  //console.log(movie.title);
                videoEl.innerHTML = `
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                `
                  trailer.appendChild(videoEl);
                console.log(key);
                }
            }
            else{
                trailer.innerHTML = `<h1 class="no-results">No Results Found</h1>`
              }
           
              
          })
      }
    }
    });*/