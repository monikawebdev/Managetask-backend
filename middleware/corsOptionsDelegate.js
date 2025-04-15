const allowedOrigins = new Set([
  'https://taskmanagerbymonika.vercel.app', // Frontend production URL
  'http://localhost:5173', // Frontend local development URL
  'http://localhost:5174', // Add this origin for local development
]);

const corsOptionsDelegate = (req, callback) => {
  const origin = req.header('Origin'); // Retrieve the Origin header from the request
  let corsOptions;

  // Always return proper CORS headers for preflight requests
  if (!origin || allowedOrigins.has(origin)) {
    // If no origin (like from Postman) or the origin is in the allowedOrigins set
    corsOptions = {
      origin: true, // Allow this origin
      credentials: true, // Allow cookies and credentials
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Added OPTIONS for preflight
      allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
      exposedHeaders: ['Content-Length', 'X-Requested-With'],
      optionsSuccessStatus: 200, // For preflight requests
      preflightContinue: false // Important for proper handling of preflight
    };
  } else {
    corsOptions = { origin: false }; // Reject other origins
  }

  callback(null, corsOptions); // Pass back the options
};

module.exports = corsOptionsDelegate;