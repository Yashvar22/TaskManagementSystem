const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error.middleware");

// Route imports
const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// CORS - allow frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, true); // Allow all in development
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Handle preflight requests
app.options("*", cors());

// Rate limiting - general
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Auth rate limiter - increased for development
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "development" ? 100 : 20,
  message: {
    success: false,
    message: "Too many auth attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Serve static files from the React app build directory
const path = require("path");
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// Catch all handler: send back React's index.html file for client-side routing
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next(); // Skip to API routes
  }
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

// Health check
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({
      success: true,
      message: "Server is running",
      timestamp: new Date(),
    });
});

// API Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
