const mongoose = require('mongoose');
require('dotenv').config();

// Use the same connection as the server
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/bookmyshow";

console.log("🔗 Connecting to database...");
console.log("📡 Using connection:", DB_URL);

mongoose.connect(DB_URL)
    .then(() => {
        console.log("✅ Connected to database successfully!");
        checkExistingMovies();
    })
    .catch(err => {
        console.error("❌ Database connection error:", err);
        process.exit(1);
    });

const checkExistingMovies = async () => {
    try {
        // Import Movie model
        const MovieModel = require('./src/Models/Movie.model');

        console.log("🎬 Checking existing movies in database...");

        // Get all movies from database
        const allMovies = await MovieModel.find({});
        
        console.log(`\n📽️ Found ${allMovies.length} movies in database:`);
        console.log("=".repeat(50));
        
        allMovies.forEach((movie, index) => {
            console.log(`${index + 1}. ${movie.movieName}`);
            console.log(`   Language: ${movie.language}`);
            console.log(`   Genre: ${movie.genre}`);
            console.log(`   Duration: ${movie.duration} minutes`);
            console.log(`   Poster: ${movie.poster}`);
            console.log("---");
        });

        // Count by language
        const hindiMovies = allMovies.filter(movie => movie.language === "Hindi");
        const englishMovies = allMovies.filter(movie => movie.language === "English");
        
        console.log(`\n📊 Summary:`);
        console.log(`   Hindi Movies: ${hindiMovies.length}`);
        console.log(`   English Movies: ${englishMovies.length}`);
        console.log(`   Total Movies: ${allMovies.length}`);

    } catch (error) {
        console.error("❌ Error checking movies:", error);
    } finally {
        mongoose.connection.close();
        console.log("🔌 Database connection closed");
    }
}; 