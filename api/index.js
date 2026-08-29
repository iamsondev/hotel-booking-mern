import app from '../apps/server/src/app.js';
import connectDB from '../apps/server/src/config/db.js';

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
