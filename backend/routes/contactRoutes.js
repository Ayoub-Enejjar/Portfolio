    const express = require('express');
    const router = express.Router(); // Create a new router instance
    const ContactMessage = require('../models/ContactMessage'); // Import the ContactMessage model

    router.post('/', async (req, res) => {
        try {
            const { name, email, meetingDate, meetingTime, message } = req.body;

            // Basic server-side validation (Mongoose schema also handles some validation)
            if (!name || !email || !message) {
                return res.status(400).json({ message: 'Name, email, and message are required fields.' });
            }

            // Create a new contact message instance
            const newContactMessage = new ContactMessage({
                name,
                email,
                meetingDate,
                meetingTime,
                message
            });

            // Save the message to the database
            await newContactMessage.save();

            // Respond with success message and the saved data
            res.status(201).json({
                message: 'Your message has been sent successfully!',
                data: newContactMessage
            });

        } catch (error) {
            // Handle validation errors or other database errors
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({ message: 'Validation failed', errors });
            }
            console.error('Error saving contact message:', error);
            res.status(500).json({ message: 'An error occurred while sending your message. Please try again.', error: error.message });
        }
    });

    // GET /api/contact - Optional: Route to retrieve all contact messages (for testing/admin)
    router.get('/', async (req, res) => {
        try {
            const messages = await ContactMessage.find().sort({ createdAt: -1 }); // Get all messages, sorted by newest first
            res.status(200).json(messages);
        } catch (error) {
            console.error('Error fetching contact messages:', error);
            res.status(500).json({ message: 'Failed to retrieve messages.', error: error.message });
        }
    });

    module.exports = router; // Export the router
    