(() => {
  const API_KEY = "api_key=860299d08527b54489820acbf28e4486";
  const BASE_URL = "https://api.themoviedb.org/3";
  const API_URLPopular =
    BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
  const API_URLTopRated =
    BASE_URL + "/movie/top_rated?" + API_KEY + "&language=en-US";
  const API_URLLatest = BASE_URL + "/movie/now_playing?" + API_KEY;
  const IMG_URL = "https://image.tmdb.org/t/p/w342";
  const trending = document.getElementById("trending");
  const movieTop10 = document.getElementById("movieTop10");
  const latestmovies = document.getElementById("NowPlaying");
  const searchbox = document.getElementById("searchbox");
  const ApiUrlMovies =
    BASE_URL + "/genre/movie/list?" + API_KEY + "&include_adult=false";
  const GenreDropdown = document.getElementById("sub_menu");
  const divsToRemove = document.getElementById("toRemove");
  let img_url = "https://image.tmdb.org/t/p/w500";
  let original_img_url = "https://image.tmdb.org/t/p/original";
  const GenreBtnEl = document.getElementById("GenreBtn");
  const genres = [
    {
      id: 28,
      name: "Action",
    },
    {
      id: 12,
      name: "Adventure",
    },
    {
      id: 16,
      name: "Animation",
    },
    {
      id: 35,
      name: "Comedy",
    },
    {
      id: 80,
      name: "Crime",
    },
    {
      id: 99,
      name: "Documentary",
    },
    {
      id: 18,
      name: "Drama",
    },
    {
      id: 10751,
      name: "Family",
    },
    {
      id: 14,
      name: "Fantasy",
    },
    {
      id: 36,
      name: "History",
    },
    {
      id: 27,
      name: "Horror",
    },
    {
      id: 10402,
      name: "Music",
    },
    {
      id: 9648,
      name: "Mystery",
    },
    {
      id: 10749,
      name: "Romance",
    },
    {
      id: 878,
      name: "Science Fiction",
    },
    {
      id: 10770,
      name: "TV Movie",
    },
    {
      id: 53,
      name: "Thriller",
    },
    {
      id: 10752,
      name: "War",
    },
    {
      id: 37,
      name: "Western",
    },
  ];

  // Pour aller à la page search: ///////////////
  searchbox.addEventListener("submit", (e) => {
    e.preventDefault();
    window.location.href = "/search?search=" + search.value;
  });
  ///////////////////////////////////////////

  ///////////Catalogue: Pour chercher par genre /////////////
  const aBtnDropdown = document.querySelectorAll(".aBtnDropdown");
  aBtnDropdown.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      //window.location.href="/catalogue";
      divsToRemove.remove();
      document.getElementById("GenreBtn").style.visibility = "visible";
      document.getElementById("movieCard").style.visibility = "visible";
      document.getElementById("pagination").style.visibility = "visible";
      document.getElementById("prev").style.visibility = "visible";
      document.getElementById("current").style.visibility = "visible";
      document.getElementById("next").style.visibility = "visible";
      const prev = document.getElementById("prev");
      const next = document.getElementById("next");
      const current = document.getElementById("current");
      var currentPage = 1;
      var nextPage = 2;
      var prevPage = 3;
      var lastUrl = "";
      var totalPages = 100;

      const main = document.querySelector(".main");
      const movieCard = document.getElementById("movieCard");
      const aBtnDropdown = document.querySelectorAll(".aBtnDropdown");
      const ActionBtn = document.getElementById("ActionM");

      searchbox.addEventListener("submit", (e) => {
        e.preventDefault();
        window.location.href = "/search?search=" + search.value;
      });

      //getMovies(API_URLPopular);

      function getMovies(url) {
        lastUrl = url;
        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            console.log(data.results);
            if (data.results.length !== 0) {
              showMovies(data.results);
              currentPage = data.page;
              nextPage = currentPage + 1;
              prevPage = currentPage - 1;
              totalPages = data.total_pages;

              current.innerText = currentPage;

              if (currentPage <= 1) {
                prev.classList.add("disabled");
                next.classList.remove("disabled");
              } else if (currentPage >= totalPages) {
                prev.classList.remove("disabled");
                next.classList.add("disabled");
              } else {
                prev.classList.remove("disabled");
                next.classList.remove("disabled");
              }
            } else {
              movieCard.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
            }
          });
      }

      function showMovies(data) {
        movieCard.innerHTML = "";

        data.forEach((movie) => {
          const { title, poster_path,vote_average, overview, id } = movie;
          const movieEl = document.createElement("div");
          movieEl.classList.add("movie2");
          movieEl.innerHTML = `
             <img src="${
               poster_path
                 ? img_url + poster_path
                 : "http://via.placeholder.com/150x150"
             }" alt="${title}">
             <div class="modal-comments modal-comments-hidden" id="comments${id}">
             <i class="fa-solid fa-xmark"></i>
              <div class="comments">
                <h1>${title}</h1>
                <p>${overview}</p>
                <button class="trailer"><a href="">Trailer</a></button>
              </div>
            </div>
            <div class="overview">
            <h3><b>${title}</b></h3>
                <span class="scoreAverage">Rated: ${vote_average}</span>
                <button class="know-more" id="${id}" title="${title}" description="${overview}">More Info</button>
            </div>`;

          movieCard.appendChild(movieEl);
          
        });
        [...document.querySelectorAll('.know-more')].forEach(el => {
          document.getElementById('comments'+el.getAttribute('id')).querySelector('.fa-xmark').addEventListener('click',()=>{
            document.getElementById('comments'+el.getAttribute('id')).classList.add('modal-comments-hidden');
         
          });
          el.addEventListener('click', ()=>{
            console.log('r');
            document.getElementById('comments'+el.getAttribute('id')).classList.remove('modal-comments-hidden');
          })
        })
      }

      prev.addEventListener("click", () => {
        if (prevPage > 0) {
          pageCall(prevPage);
        }
      });

      next.addEventListener("click", () => {
        if (nextPage <= totalPages) {
          pageCall(nextPage);
        }
      });

      function pageCall(page) {
        let urlSplit = lastUrl.split("?");
        let queryParams = urlSplit[1].split("&");
        let key = queryParams[queryParams.length - 1].split("=");
        if (key[0] != "page") {
          let url = lastUrl + "&page=" + page;
          getMovies(url);
        } else {
          key[1] = page.toString();
          let a = key.join("=");
          queryParams[queryParams.length - 1] = a;
          let b = queryParams.join("&");
          let url = urlSplit[0] + "?" + b;
          getMovies(url);
        }
      }

      //select genre:

      //aBtnDropdown[0].addEventListener('click', ()=>{
      GenreBtnEl.innerHTML = "";
      const title = document.createElement("h3");
      title.classList.add("genreTitle");
      //title.id="28";
      title.innerText = btn.innerHTML;
      for (let genre of genres) {
        if (genre.name == btn.innerText) {
          console.log(genres[0].name);
          console.log(btn.innerText);
          const idBtn = genre.id;

          getMovies(API_URLPopular + "&with_genres=" + encodeURI(idBtn));
          GenreBtnEl.append(title);
        }
      }
      //})
    });
  });

  /////////////////////////////////
  ////////////Page Index://///////////////////////////////////////////
  getPopularMovies(API_URLPopular);
  getTopRatedMovies(API_URLTopRated);
  getLatestMovies(API_URLLatest);

  function getPopularMovies(url) {
    lastUrl = url;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.results);
        showPopularMovies(data.results);
      });
  }

  function showPopularMovies(data) {
    trending.innerHTML = "";

    data.forEach((movie) => {
      const { title, poster_path,vote_average, overview, id } = movie;
      const movieEl = document.createElement("div");
      movieEl.classList.add("movie");
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
                <p>${overview}</p>
                <button class="trailer"><a href="">Trailer</a></button>
              </div>
            </div>
            <div class="overview">
            <h3><b>${title}</b></h3>
                <span class="scoreAverage">Rated: ${vote_average}</span>
                <button class="know-more" id="${id}" title="${title}" description="${overview}">More Info</button>
            </div>`;

      trending.appendChild(movieEl);
      
    });
    [...document.querySelectorAll('.know-more')].forEach(el => {
      document.getElementById('comments'+el.getAttribute('id')).querySelector('.fa-xmark').addEventListener('click',()=>{
        document.getElementById('comments'+el.getAttribute('id')).classList.add('modal-comments-hidden');
     
      });
      el.addEventListener('click', ()=>{
        console.log('r');
        document.getElementById('comments'+el.getAttribute('id')).classList.remove('modal-comments-hidden');
      })
    })
  }
  function getTopRatedMovies(url) {
    lastUrl = url;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.results);
        showTopRatedMovies(data.results);
      });
  }

  function showTopRatedMovies(data) {
    movieTop10.innerHTML = "";

    data.forEach((movie) => {
      const { title, poster_path,vote_average, overview, id } = movie;

      const movieEl = document.createElement("div");
      movieEl.classList.add("movie");
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
               <p>${overview}</p>
               <button class="trailer"><a href="">Trailer</a></button>
             </div>
           </div>
            <div class="overview">
            <h3><b>${title}</b></h3>
                <span class="scoreAverage">Rated: ${vote_average}</span>
                <button class="know-more" id="${id}" title="${title}" description="${overview}">More Info</button>
            </div>`;

      movieTop10.appendChild(movieEl);

      
    });
    [...document.querySelectorAll('.know-more')].forEach(el => {
      document.getElementById('comments'+el.getAttribute('id')).querySelector('.fa-xmark').addEventListener('click',()=>{
        document.getElementById('comments'+el.getAttribute('id')).classList.add('modal-comments-hidden');
     
      });
      el.addEventListener('click', ()=>{
        console.log('r');
        document.getElementById('comments'+el.getAttribute('id')).classList.remove('modal-comments-hidden');
      })
    })
  }

  //console.log(searchURL);
  function getLatestMovies(url) {
    lastUrl = url;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.results);
        showLatestMovies(data.results);
      });
  }

  function showLatestMovies(data) {
    latestmovies.innerHTML = "";

    data.forEach((movie) => {
      const { title, poster_path, vote_average,overview, id } = movie;

      const movieEl = document.createElement("div");
      movieEl.classList.add("movie");
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
                <p>${overview}</p>
                <button class="trailer"><a href="">Trailer</a></button>
              </div>
            </div>
            <div class="overview">
            <h3><b>${title}</b></h3>
                <span class="scoreAverage">Rated: ${vote_average}</span>
                <button class="know-more" id="${id}" title="${title}" description="${overview}">More Info</button>
            </div>`;

          
            latestmovies.appendChild(movieEl);

     
    });

    [...document.querySelectorAll('.know-more')].forEach(el => {
      document.getElementById('comments'+el.getAttribute('id')).querySelector('.fa-xmark').addEventListener('click',()=>{
        document.getElementById('comments'+el.getAttribute('id')).classList.add('modal-comments-hidden');
        console.log('comments'+el.getAttribute('id'));
      });
      el.addEventListener('click', ()=>{
      
        document.getElementById('comments'+el.getAttribute('id')).classList.remove('modal-comments-hidden');
      })
    })
  }
})();



// fetch('http://localhost:3000/test').then(res => res.json()).then(data => console.log(data))