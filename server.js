require("dotenv").config();
const expressApp = require("./backend/app/expressApp");
const next = require("next");
const connectDB = require("./backend/config/db");

const dev = process.env.NODE_ENV !== "production";
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
      console.log(`\n[Stampy] ✅ Unified Server running on port ${PORT}`);
      console.log(`[Stampy]    Mode: ${dev ? "Development" : "Production"}`);
      console.log(`[Stampy]    API  → http://localhost:${PORT}/api`);
      console.log(`[Stampy]    App  → http://localhost:${PORT}/\n`);
    });
  } catch (error) {
    console.error("[Stampy Fatal Error]:", error);
    process.exit(1);
  }
}

startServer();
