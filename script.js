// Define the raw URL of the CSV file in your GitHub repository
const csvUrl = "https://raw.githubusercontent.com/MartinEBravo/movie-rating-predictor-service/main/movies.csv";

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

// Function to populate the gallery with movie cards
async function populateGallery() {
    const gallery = document.getElementById("gallery");
    const spinner = document.getElementById("loadingSpinner");
    spinner.style.display = "block"; // Show the spinner

    try {
        const movies = await fetchCSV(csvUrl);
        spinner.style.display = "none"; // Hide the spinner
        gallery.innerHTML = ''; // Clear any existing content

        movies.forEach(movie => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>Predicted Rating: ${movie.predicted_rating || "N/A"}</p>
            `;

            gallery.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching or parsing CSV:", error);
        spinner.style.display = "none";
        gallery.innerHTML = `<p>Error loading movies. Please try again later.</p>`;
    }
}

// Attach search functionality
async function attachSearchFunctionality() {
    const searchBar = document.getElementById("searchBar");
    const movies = await fetchCSV(csvUrl);

    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
        const filteredMovies = movies.filter(movie =>
            movie.title.toLowerCase().includes(query)
        );

        const gallery = document.getElementById("gallery");
        gallery.innerHTML = ''; // Clear gallery
        filteredMovies.forEach(movie => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>Predicted Rating: ${movie.predicted_rating || "N/A"}</p>
            `;

            gallery.appendChild(card);
        });
    });
}

// Initialize the gallery and search functionality on page load
document.addEventListener("DOMContentLoaded", async () => {
    await populateGallery();
    await attachSearchFunctionality();
});
