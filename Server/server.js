const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

const authRoutes = require('./src/Routes/auth.routes');
const movieRoutes = require('./src/Routes/movies.routes')
const theatreRoutes = require("./src/Routes/theatre.routes");
const showRoutes = require('./src/Routes/show.routes');
const bookingRoutes = require('./src/Routes/booking.routes');
var bodyParser = require('body-parser')
var cors = require('cors');
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();

app.use(bodyParser.json())
app.use(cors())

// Add a simple test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Try to connect to MongoDB, but don't fail if it's not available
mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/bookmyshow')
.then(()=>{
    console.log("Successfully connected to the database");
})
.catch((err)=>{
    console.log("Unable to connect to the DB", err);
    console.log("Server will continue without database connection");
})

// Create different rate limiters for different endpoints
const generalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: {
        status: 429,
        error: "Too many Requests",
        message: "You have exceeded the request limit. Please try again later"
    }
});

const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 50, // 50 login attempts per minute
    message: {
        status: 429,
        error: "Too many login attempts",
        message: "Too many login attempts. Please try again in 1 minute"
    }
});

const bookingLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 50, // 50 booking attempts per minute
    message: {
        status: 429,
        error: "Too many booking attempts",
        message: "Too many booking attempts. Please try again later"
    }
});

// Apply rate limiting middleware
app.use('/auth', authLimiter); // Stricter limit for auth endpoints
app.use('/bookings', bookingLimiter); // Moderate limit for booking endpoints
app.use(generalLimiter); // General limit for all other endpoints

// Replace prohibited characters with _
app.use(
    mongoSanitize({
        replaceWith:"_"     // Replace $ and . with _
    })
)

authRoutes(app);
movieRoutes(app);
theatreRoutes(app);
showRoutes(app);
bookingRoutes(app);

app.listen(process.env.PORT,()=>{
    console.log("Server is running on port 8000");
})







//internal 
//IP Based 
// Client  (For shipping business : shipper based)
// Channel Based 