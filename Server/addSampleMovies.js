const mongoose = require('mongoose');
const MovieModel = require('./src/Models/Movie.model');
require('dotenv').config();

const sampleMovies = [
    {
        movieName: "Avengers: Endgame",
        description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
        duration: 181,
        genre: ["Action", "Adventure", "Drama"],
        language: "English",
        poster: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",
        releaseDate: new Date("2019-04-26")
    },
    {
        movieName: "The Dark Knight",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        duration: 152,
        genre: ["Action", "Crime", "Drama"],
        language: "English",
        poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
        releaseDate: new Date("2008-07-18")
    },
    {
        movieName: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        duration: 148,
        genre: ["Action", "Adventure", "Sci-Fi"],
        language: "English",
        poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
        releaseDate: new Date("2010-07-16")
    },
    {
        movieName: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        duration: 169,
        genre: ["Adventure", "Drama", "Sci-Fi"],
        language: "English",
        poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        releaseDate: new Date("2014-11-07")
    },
    {
        movieName: "The Shawshank Redemption",
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        duration: 142,
        genre: ["Drama"],
        language: "English",
        poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
        releaseDate: new Date("1994-09-22")
    }
];

async function addSampleMovies() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/bookmyshow');
        console.log('Connected to MongoDB');

        // Clear existing movies
        await MovieModel.deleteMany({});
        console.log('Cleared existing movies');

        // Add sample movies
        const result = await MovieModel.insertMany(sampleMovies);
        console.log(`Added ${result.length} sample movies to the database`);

        // Display added movies
        result.forEach(movie => {
            console.log(`- ${movie.movieName} (${movie.duration} min)`);
        });

        console.log('\nSample movies added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error adding sample movies:', error);
        process.exit(1);
    }
}

addSampleMovies(); 