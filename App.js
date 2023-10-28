// to store movies
let movies=[];
let currentPage=1;
async function fetchMovies(page) {
    try {
       const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${page}`); 
       const result = await response.json();
        movies = result.results;
        renderMovies(movies);
    } catch (error) {
        console.log(error);
    }
}
// function to display the movies in the html page
const renderMovies =(movies)=>{
    const movieList = document.getElementById("movies-list");
    movieList.innerHTML="";
    movies.map((movie)=>{
       const { poster_path,title,vote_count,vote_average}= movie;
       const listItem=document.createElement("li");
       listItem.className="card";
       let imgSrc =poster_path? `https://image.tmdb.org/t/p/original/${poster_path}`
       :"https://w7.pngwing.com/pngs/116/765/png-transparent-clapperboard-computer-icons-film-movie-poster-angle-text-logo-thumbnail.png"
       listItem.innerHTML+=`<img class="poster" src=${imgSrc} alt=${title}/>
                        <p class="title">${title}</p>
                        <section class="vote-favoriteIcon" >
                            <section class="vote">
                                <p class="vote-count">${vote_count}</p>
                                <p class="vote-average">${vote_average}</p>
                            </section>
                            <i class="fa-regular fa-heart fa-2xl" id="favorite-icon"></i>
                        </section> `;
          movieList.appendChild(listItem);              
    });
};
// logic to sort by date
// for checking if the sort by date button clicking first time or not
let firstSortByDateClick = true;
 const sortByDateButton = document.getElementById("sort-by-date");
function sortByDate(){
    let sortedMovies;
    if(firstSortByDateClick){
        sortedMovies = movies.sort((a,b)=> new Date(a.release_date)- new Date(b.release_date));
        sortByDateButton.textContent ="Sort by date (latest to oldest)";
        firstSortByDateClick = false;
    }
    else if(!firstSortByDateClick){
        sortedMovies = movies.sort((a,b)=> new Date(b.release_date)- new Date(a.release_date));
        sortByDateButton.textContent ="Sort by date (oldest to latest)";
        firstSortByDateClick = true;
    }
    renderMovies(sortedMovies);
}

let firstSortByRatingClick = true;
 const sortByRatingButton = document.getElementById("sort-by-rating");
function sortByRating(){
    let sortedMovies;
    if(firstSortByRatingClick){
        sortedMovies = movies.sort((a,b)=> (a.vote_average)- (b.vote_average));
        sortByRatingButton.textContent ="Sort by rating (least to most)";
        firstSortByRatingClick = false;
    }
    else if(!firstSortByRatingClick){
        sortedMovies = movies.sort((a,b)=>(b.vote_average)-(a.vote_average));
        sortByRatingButton.textContent ="Sort by rating (most to least)";
        firstSortByRatingClick = true;
    }
    renderMovies(sortedMovies);
}

sortByRatingButton.addEventListener("click",sortByRating);
sortByDateButton.addEventListener("click",sortByDate);
fetchMovies(currentPage);

// to search
const searchInput=document.getElementById("search-input");
const searchButton=document.getElementById("search-button");
searchButton.addEventListener('click',()=>{
    const query =searchInput.value.trim();
    if(query !== ''){
        const searchResults=movies.filter(movie=> movie.title.toLowerCase().includes(query.toLowerCase()));
        renderMovies(searchResults);
    }
});

//favorite
const favorites=[];
function toggleFavorite(movie, icon){
    const movieId=movie.id;
    const isFavorite=favorites.includes(movieId);

    if(isFavorite){
        const fav=favorites.indexOf(movieId);
        if(fav>-1){
            favorites.splice(fav,1)
        }
        icon.classList.remove('fa-solid', 'fa-heart');
        icon.classList.add('fa-regular','fa-heart');
    }else{
        favorites.push(movieId);
        icon.classList.add('fa-regular','fa-heart');
        icon.classList.remove('fa-solid', 'fa-heart');
    }
    localStorage.setItem('favorites',JSON.stringify(favorites));
}

function loadFavorites(){
    const favoritesData=localStorage.getItem('favorites');
    if(favoritesData){
        favorites.push(...JSON.parse(favoritesData));
    }
}

function updateFavoriteIcons(){
    const favoriteIcons=document.querySelectorAll('.fa-heart');
    favoriteIcons.forEach(icon => {
        const movieId =parseInt(icon.dataset.movieId);
        if(favorites.includes(movieId)){
            icon.classList.add('fa-regular','fa-heart');
            icon.classList.remove('fa-solid', 'fa-heart');
        }
    });
}
//all and favorite tabs
const allTabButton = document.getElementById('all-tab');
const favoritesTabButton = document.getElementById('favorites-tab');

allTabButton.addEventListener('click', () => {
    renderMovies(movies);
    allTabButton.classList.add('active-tab');
    favoritesTabButton.classList.remove('active-tab');
});

favoritesTabButton.addEventListener('click', () => {
    const favoriteMovies = movies.filter(movie => favorites.includes(movie.id));
    renderMovies(favoriteMovies);
    favoritesTabButton.classList.add('active-tab');
    allTabButton.classList.remove('active-tab');
});
// pagination
const prevButton = document.getElementById('prev-button');
const pageButton = document.getElementById('page-number-button');
const nextButton = document.getElementById('next-button');

prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadPage(currentPage);
    }
});

nextButton.addEventListener('click', () => {
    if (currentPage < 3) {
        currentPage++;
        loadPage(currentPage);
    }
});

// Initialize the page number
pageButton.textContent = `Current Page: ${currentPage}`;




