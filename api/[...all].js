const { app, connectMongo } = require('../server/src/app');

module.exports = async (req, res) => {
  try {
    await connectMongo();
    return app(req, res);
  } catch (err) {
    return res.status(500).json({
      error: 'Server initialization failed',
      detail: err?.message || 'Unknown error',
    });
  }
};
