// Server entry point - listens on port and handles server startup
import app from './app.js';
import connectDB from './config/db.js';
import { env } from './config/env.js';

const PORT = env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  });
});
