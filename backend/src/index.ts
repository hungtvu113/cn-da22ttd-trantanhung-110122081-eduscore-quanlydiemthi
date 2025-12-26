import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware/errorHandler";

// Initialize express
const app: Application = express();

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:3000",
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => origin.startsWith(allowed.replace(/\/$/, '')) || allowed.includes(origin))) {
      return callback(null, true);
    }
    
    // Allow any vercel.app subdomain
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api", routes);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "EduScore API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Welcome route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to EduScore API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      subjects: "/api/subjects",
      exams: "/api/exams",
      users: "/api/users",
      scores: "/api/scores",
    },
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🎓 EduScore API Server                          ║
║                                                   ║
║   ✅ Server running on port ${PORT}                  ║
║   ✅ Environment: ${process.env.NODE_ENV || "development"}               ║
║                                                   ║
║   📍 Local:   http://localhost:${PORT}               ║
║   📍 Health:  http://localhost:${PORT}/health        ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});

export default app;

