require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');

// Get the MongoDB connection string from environment variables
const uri = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        // Connect to MongoDB
        const conn = await mongoose.connect(uri);

        // Success message with connection details
        console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    } catch (error) {
        // Error message for failed connection
        console.error('Error: MongoDB failed to connect', error.message);
        process.exit(1); // Exit the process with failure
    }
};

// Export the connection function
module.exports = connectDB;
