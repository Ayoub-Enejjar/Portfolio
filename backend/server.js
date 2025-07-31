    // backend/server.js
    require('dotenv').config(); // Load environment variables from .env file

    const express = require('express');
    const mongoose = require('mongoose');
    const cors = require('cors'); // Import cors middleware

    const contactRoutes = require('./routes/contactRoutes'); // Import your contact routes

    const app = express();
    const PORT = process.env.PORT || 3000; // Use port from .env or default to 3000
    const MONGODB_URI = process.env.MONGODB_URI;

    // --- Middleware Setup ---
    app.use(cors()); // Enable CORS for all origins (for development)
    app.use(express.json()); // Parse incoming JSON requests

    // --- MongoDB Connection ---
    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true, // Mongoose 6.x+ no longer supports/needs these options
        // useFindAndModify: false,
    })
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    });

    // --- API Routes ---
    // Use the contact routes for requests starting with /api/contact
    app.use('/api/contact', contactRoutes);

    // Basic root route for testing if the server is running
    app.get('/', (req, res) => {
        res.send('Welcome to the Portfolio Backend API!');
    });

    // --- Error Handling Middleware (Optional, but good practice) ---
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

    // --- Start the Server ---
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
    