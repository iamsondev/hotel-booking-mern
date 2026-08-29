export default async function handler(req, res) {
  try {
    const { default: app } = await import('../apps/server/src/app.js');
    const { default: connectDB } = await import('../apps/server/src/config/db.js');

    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Vercel DB Connection Error:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Failed to connect to database',
      error: error.message,
    });
  }
}
