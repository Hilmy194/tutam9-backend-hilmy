import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import authenticate from './middleware/authMiddleware.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: "https://https://tutam9-frontend-hilmy.vercel.app/", 
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', authenticate, transactionRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => console.log('Server running on port', process.env.PORT));
  })
  .catch(err => console.error('MongoDB connection error:', err));
