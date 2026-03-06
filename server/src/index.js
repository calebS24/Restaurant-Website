require("dotenv").config();
const { app, connectMongo } = require("./app");
const PORT = process.env.PORT || 5000;

function sanitizeMongoUri(uri) {
  if (!uri) return "";
  return uri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:***@");
}

function logMongoHelp() {
  // eslint-disable-next-line no-console
  console.log("[Mongo] Check these:");
  // eslint-disable-next-line no-console
  console.log("1) Atlas Database Access username/password");
  // eslint-disable-next-line no-console
  console.log("2) Atlas Network Access includes your IP");
  // eslint-disable-next-line no-console
  console.log("3) MONGODB_URI in server/.env matches the Atlas user exactly");
}

async function connectMongoWithRetry() {
  const retryMs = 8000;
  try {
    await connectMongo();
    // eslint-disable-next-line no-console
    console.log("[Mongo] Connected");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[Mongo] Connection failed:", err?.message || err);
    logMongoHelp();
    setTimeout(connectMongoWithRetry, retryMs);
  }
}

async function startServer() {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API running on http://localhost:${PORT}`);
    // eslint-disable-next-line no-console
    console.log(
      `[Mongo] Using URI: ${sanitizeMongoUri(process.env.MONGODB_URI)}`,
    );
    connectMongoWithRetry();
  });
}

startServer().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
