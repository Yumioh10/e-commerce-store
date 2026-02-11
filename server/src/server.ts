import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
});

/*import dotenv from 'dotenv';
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
const PORT = process.env.PORT || 5000;
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
});*/