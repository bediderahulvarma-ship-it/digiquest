const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorMiddleware');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend communication
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Initialize SQLite Database & Tables
const db = require('./database/db');

// Import Route definitions
const projectRoutes = require('./routes/projectRoutes');
const customerRoutes = require('./routes/customerRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes');
const commentRoutes = require('./routes/commentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');

// Create uploads folder if not exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Mount Route routers
app.use('/api/projects', projectRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

// Optional: Serve frontend static assets in production mode
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Wildcard fallback to index.html for React router support (production only)
app.get('*', (req, res, next) => {
  // Only serve if build files exist
  if (require('fs').existsSync(path.join(frontendBuildPath, 'index.html'))) {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  } else {
    res.status(404).json({ error: 'Endpoint not found' });
  }
});

// Register global error middleware
app.use(errorHandler);

// Listen on configured port
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` DigiQuest Post-Production Server running on port ${PORT} `);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(`===================================================`);
});
