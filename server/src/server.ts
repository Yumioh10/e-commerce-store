import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const jwt = require("jsonwebtoken")
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/database';
import { config } from './config/env';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Routes
app.use('/api/v1', routes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});