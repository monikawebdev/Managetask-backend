// Define a set of allowed origins
const allowedOrigins = new Set([
  "http://localhost:5173", // Add more origins as needed
  "https://taskmanagerbymonika.vercel.app"
]);

// CORS options delegate function
const corsOptionsDelegate = (req, callback) => {
  const origin = req.header('Origin'); // Retrieve the Origin header from the request
  let corsOptions;

  if (origin && allowedOrigins.has(origin)) {
    // If the origin is in the allowedOrigins set
    corsOptions = {
      origin: true, // Allow this origin
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
      credentials: true, // Allow credentials (e.g., cookies)
      optionsSuccessStatus: 200, // Status for successful preflight requests
    };
  } else {
    // If the origin is not allowed
    corsOptions = { origin: false };
  }

  // Pass the options to the callback
  console.log(`CORS - Request Origin: ${origin}, Allowed: ${corsOptions.origin}`);
  callback(null, corsOptions);
};

module.exports = corsOptionsDelegate;