require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import Supabase client
const supabase = require('./utils/supabaseClient');
const setupDatabase = require('./utils/setupDatabase');

// Import routes
const brandRoutes = require('./routes/brands');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const leaderboardRoutes = require('./routes/leaderboard');
const subscriberRoutes = require('./routes/subscriber');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Log Supabase connection info
console.log('Initializing Supabase client with service role permissions');
console.log('Using URL:', process.env.SUPABASE_URL);
console.log('Service key provided:', process.env.SUPABASE_SERVICE_KEY ? 'Yes' : 'No');

// Initialize Supabase connection and setup database tables
console.log('Initializing Supabase connection...');
setupDatabase().then(success => {
  if (success) {
    console.log('✅ Database setup completed successfully');
  } else {
    console.error('❌ Database setup failed');
  }
});

// Test the Supabase connection by making a simple query
supabase.from('brands').select('count').then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase connection error:', error);
  } else {
    console.log('✅ Supabase connected successfully!');
    console.log(`Found ${data[0]?.count || 0} brands in the database`);
  }
});

// Simple CORS configuration (uncomment if having issues with the complex one)
/*
app.use(cors({
  origin: '*',  // WARNING: This allows any website to make requests to your API
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
*/

// Complex CORS configuration with specific origins
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Log all CORS requests for debugging
    console.log('CORS request from origin:', origin);

    // Temporary: Allow all origins if CORS_DEBUG is set to 'true'
    if (process.env.CORS_DEBUG === 'true') {
      console.log('CORS debug mode enabled - allowing all origins');
      return callback(null, true);
    }
    
    // Define allowed origins - both with and without trailing slash
    const allowedOrigins = [
      'https://topthcbrands.netlify.app',
      'https://topthcbrands.netlify.app/',
      'http://topthcbrands.com',
      'https://topthcbrands.com',
      'http://www.topthcbrands.com',
      'https://www.topthcbrands.com',
      // With trailing slashes
      'http://topthcbrands.com/',
      'https://topthcbrands.com/',
      'http://www.topthcbrands.com/',
      'https://www.topthcbrands.com/',
      process.env.CLIENT_URL,
      process.env.CLIENT_URL + '/',
      'http://localhost:5173',
      'http://localhost:5173/'
    ];
    
    // Allow all origins in development mode
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked request from:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files directory for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Add explicit handling for OPTIONS requests (CORS preflight)
app.options('*', cors());

// Routes
app.use('/api/brands', brandRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/subscribe', subscriberRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// API root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Top THC Brands API', 
    version: '1.0.0',
    endpoints: [
      '/api/brands',
      '/api/contact',
      '/api/auth',
      '/api/admin',
      '/api/leaderboard',
      '/api/subscribe',
      '/api/db-status'
    ] 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 