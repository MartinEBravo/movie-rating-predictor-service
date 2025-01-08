// Define the CSV file URL
const csvUrl = "docs/movies.csv";

// Fetch and parse the CSV file
async function fetchCSV(url) {
    const response = await fetch(url);
    const csvText = await response.text();
    const rows = csvText.split("\n").map(row => row.split(","));
    const headers = rows[0];
    return rows.slice(1).map(row => {
        const obj = {};
        row.forEach((value, index) => {
            obj[headers[index].trim()] = value.trim();
        });
        return obj;
    });
}

// Function to populate the gallery
async function populateGallery() {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = ''; // Clear existing content
    const movies = await fetchCSV(csvUrl);

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
        `;

        card.addEventListener("click", () => showMovieDetails(movie));
        gallery.appendChild(card);
    });
}


// Function to create a movie card
function createMovieCard(movie) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
        <h3>${movie.title}</h3>
    `;
    card.addEventListener("click", () => showMovieDetails(movie));
    return card;
}

// Function to attach search functionality
function attachSearchFunctionality(movies) {
    const searchBar = document.getElementById("searchBar");
    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
        const filteredMovies = movies.filter(movie =>
            movie.title.toLowerCase().includes(query)
        );

        // Clear and re-render the gallery with filtered movies
        const gallery = document.getElementById("gallery");
        gallery.innerHTML = '';
        filteredMovies.forEach(movie => {
            const card = createMovieCard(movie);
            gallery.appendChild(card);
        });
    });
}

// Populate the gallery on page load
document.addEventListener("DOMContentLoaded", populateGallery);