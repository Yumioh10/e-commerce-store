import mongoose, { Error } from 'mongoose';
import app from './app'; // express setup
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;
const DB_URI = process.env.MONGO_URI;

/**
 * Connects to MongoDB and starts the Express server.
 */
const startServer = async () => {
    if (!DB_URI) {
        console.error('Error: DB_URI is not defined in .env file');
        // Exits process with failure code 1
        process.exit(1); 
    }

    try {
        // 1. AWAIT the Mongoose connection
        const connection = await mongoose.connect(DB_URI);
        
        console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
        
        // 2. Start listening only after a successful DB connection
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
        
    } catch (error) {
        // Catch any connection errors
        console.error('❌ MongoDB connection error:', Error.messages);
        process.exit(1);
    }
};

// Execute the main startup function
startServer();