require("dotenv").config();
const expressApp = require("./backend/app/expressApp");
const next = require("next");
const connectDB = require("./backend/config/db");

const isDevelopmentScript = ["dev", "dev:all"].includes(
  process.env.npm_lifecycle_event
);
const dev = isDevelopmentScript || process.env.NODE_ENV !== "production";
if (isDevelopmentScript) {
  process.env.NODE_ENV = "development";
}
const PORT = parseInt(process.env.PORT, 10) || 5000;
const hostname = "0.0.0.0";

async function startServer() {
  try {
    await connectDB();
    const nextApp = next({ dev, hostname, port: PORT });
    const handle = nextApp.getRequestHandler();
    await nextApp.prepare();

    // Next.js handles all non-API requests through the express app
    expressApp.use((req, res) => {
      return handle(req, res);
    });

    expressApp.listen(PORT, () => {
      console.log(`\n[Notch] ✅ Unified Server running on port ${PORT}`);
      console.log(`[Notch]    Mode: ${dev ? "Development" : "Production"}`);
      console.log(`[Notch]    API  → http://localhost:${PORT}/api`);
      console.log(`[Notch]    App  → http://localhost:${PORT}/\n`);
    });
  } catch (error) {
    console.error("[Notch Fatal Error]:", error);
    process.exit(1);
  }
}

startServer();
