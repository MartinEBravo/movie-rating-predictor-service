// Define the CSV file URL
const csvUrl = "movies.csv";

// Function to fetch and parse the CSV file
async function fetchCSV(url) {
    const response = await fetch(url);
    const csvText = await response.text();
    const rows = csvText.split("\n").map(row => row.split(","));
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
        const obj = {};
        row.forEach((value, index) => {
            obj[headers[index].trim()] = value.trim();
        });
        return obj;
    });
    return data;
}

// Populate the gallery with movie posters
async function populateGallery() {
    const gallery = document.getElementById("gallery");
    const movies = await fetchCSV(csvUrl);

    movies.forEach(movie => {
        const img = document.createElement("img");
        img.src = movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : "https://via.placeholder.com/150x225";
        img.alt = movie.title;
        img.title = movie.title;

        // Add click event to show movie details
        img.addEventListener("click", () => showMovieDetails(movie));

        gallery.appendChild(img);
    });
}

// Show movie details in a modal
function showMovieDetails(movie) {
    const modal = document.getElementById("movieModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDetails = document.getElementById("modalDetails");

    // Log the IMDb URL for debugging
    console.log(`Redirecting to IMDb: https://www.imdb.com/title/${movie.imdb_id}/`);

    modalTitle.innerHTML = `
        <a href="https://www.imdb.com/title/${movie.imdb_id}/" target="_blank" style="text-decoration: none; color: #007BFF;">
            ${movie.title}
        </a>
    `;

    modalDetails.innerHTML = `
        <p><strong>Release Date:</strong> ${movie.release_date || "N/A"}</p>
        <p><strong>Genres:</strong> ${movie.genres.replace("|", ", ") || "N/A"}</p>
        <p><strong>Director:</strong> ${movie.director || "N/A"}</p>
        <p><strong>Cast:</strong> ${movie.cast.split("|").slice(0, 5).join(", ") || "N/A"}</p>
        <p><strong>IMDB Rating:</strong> ${movie.imdb_rating || "N/A"}</p>
        <p><strong>Predicted Rating:</strong> ${movie.predicted_rating || "N/A"}</p>
        <p><strong>IMDB Votes:</strong> ${movie.imdb_votes || "N/A"}</p>
        <p><strong>Overview:</strong> ${movie.overview || "N/A"}</p>
    `;

    // Show modal
    modal.style.display = "block";
}

// Close the modal
document.getElementById("modalClose").addEventListener("click", () => {
    const modal = document.getElementById("movieModal");
    modal.style.display = "none";
});

// Populate the gallery on page load
document.addEventListener("DOMContentLoaded", populateGallery);
