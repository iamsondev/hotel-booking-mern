import app from './app.js';
import connectDB from './config/db.js';
import { env } from './config/env.js';

const PORT = env.PORT || 5000;

// Connect to Database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  });
});
