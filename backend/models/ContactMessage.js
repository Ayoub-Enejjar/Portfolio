    // backend/models/ContactMessage.js
    const mongoose = require('mongoose');

    // Define the schema for contact messages
    const contactMessageSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true // Removes whitespace from both ends of a string
        },
        email: {
            type: String,
            required: true,
            unique: false, // Email doesn't need to be unique for contact messages
            lowercase: true, // Stores emails in lowercase
            trim: true,
            match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address'] // Basic email regex validation
        },
        meetingDate: {
            type: Date,
            required: false // Optional field
        },
        meetingTime: {
            type: String,
            required: false // Optional field
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now // Automatically sets the creation date
        }
    });

    // Create the Mongoose model from the schema
    const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

    module.exports = ContactMessage; // Export the model for use in other files
    