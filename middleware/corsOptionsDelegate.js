const allowedOrigins = new Set([
    'http://localhost:5173',
    'https://financeget.vercel.app',
    'https://financeget.netlify.app/'
  ]);
  
  const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    
    if (allowedOrigins.has(req.header('Origin'))) {
      corsOptions = {
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
        optionsSuccessStatus: 200,
      };
    } else {
      corsOptions = { origin: false };
    }
    
    callback(null, corsOptions);
  };