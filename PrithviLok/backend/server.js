// ============================================================
// PrithviLok Backend - Main Server Entry Point
// ============================================================
import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { Server as SocketServer } from 'socket.io';
import connectDB from './config/db.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { initializeSockets } from './sockets/chatSocket.js';

// Route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import dustbinRoutes from './routes/dustbin.js';
import environmentRoutes from './routes/environment.js';
import communityRoutes from './routes/community.js';
import learningRoutes from './routes/learning.js';
import leaderboardRoutes from './routes/leaderboard.js';
import adminRoutes from './routes/admin.js';
import impactRoutes from './routes/impact.js';

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new SocketServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Connect to MongoDB
connectDB();

// ---- Global Middleware ----
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(globalLimiter);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// ---- API Routes ----
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '🌍 PrithviLok API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dustbins', dustbinRoutes);
app.use('/api/environment', environmentRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/impact', impactRoutes);

// ---- Error Handling ----
app.use(notFound);
app.use(errorHandler);

// ---- Socket.io ----
initializeSockets(io);

// Make io accessible to routes
app.set('io', io);

// ---- Start Server ----
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🌿 PrithviLok Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});

export { io };
