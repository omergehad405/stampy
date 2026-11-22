require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");
const connectDB = require("./backend/config/db");
const authRoutes = require("./backend/app/routing/authRoutes");
const adminCafeRoutes = require("./backend/app/routing/adminCafeRoutes");
const adminCustomerRoutes = require("./backend/app/routing/adminCustomerRoutes");
const adminPlanRoutes = require("./backend/app/routing/adminPlanRoutes");
const adminAnnouncementRoutes = require("./backend/app/routing/adminAnnouncementRoutes");
const announcementRoutes = require("./backend/app/routing/announcementRoutes");
const cafeRewardRoutes = require("./backend/app/routing/cafeRewardRoutes");
const cafeRoutes = require("./backend/app/routing/cafeRoutes");
const dashboardCafeRoutes = require("./backend/app/routing/dashboardCafeRoutes");

// Single public port — both API and Next.js frontend served here
const PORT = parseInt(process.env.PORT, 10) || 5000;
// Next.js dev server runs internally on this port (never exposed directly)
const NEXT_PORT = parseInt(process.env.NEXT_PORT, 10) || 3001;

async function startServer() {
  try {
    await connectDB();

    const app = express();

    // ── Chrome DevTools Probe ─────────────────────────────────────────────────
    // Silently acknowledge Chrome DevTools probing to prevent CSP / 404 console warnings
    app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
      res.status(204).end();
    });

    // ── CORS ──────────────────────────────────────────────────────────────────
    const customAllowedOrigins = (process.env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);

    const isOriginAllowed = (origin) => {
      if (!origin) return true; // Server-to-server, curl, Postman
      // Localhost or 127.0.0.1 on any port (e.g. :3000, :5000, :5173)
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
      // Vercel deployment preview / production domains
      if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return true;
      // Any custom origins from .env
      if (customAllowedOrigins.includes(origin)) return true;
      return false;
    };

    app.use(
      cors({
        origin(origin, callback) {
          if (isOriginAllowed(origin)) {
            callback(null, true);
          } else {
            callback(null, false);
          }
        },
        credentials: true, // Required for HttpOnly cookie auth
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
        optionsSuccessStatus: 200,
      })
    );

    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true, limit: "10mb" }));
    app.use(cookieParser());

    // ── Health check ─────────────────────────────────────────────────────────
    app.get("/api/health", (req, res) => {
      res.status(200).json({
        success: true,
        message: "Stampy API is healthy",
        timestamp: new Date().toISOString(),
        port: PORT,
      });
    });

    // ── Root — handled by Next.js via the proxy below ────────────────────────

    // ── API Routes ────────────────────────────────────────────────────────────
    app.use("/api/auth", authRoutes);
    app.use("/api/announcements", announcementRoutes);
    app.use("/api/admin/cafes", adminCafeRoutes);
    app.use("/api/admin/customers", adminCustomerRoutes);
    app.use("/api/admin/plans", adminPlanRoutes);
    app.use("/api/admin/announcements", adminAnnouncementRoutes);
    app.use("/api/dashboard/rewards", cafeRewardRoutes);
    app.use("/api/rewards", cafeRewardRoutes);
    app.use("/api/cafes", cafeRoutes);
    app.use("/api/dashboard/cafe", dashboardCafeRoutes);
    app.use("/api/dashboard/profile", dashboardCafeRoutes);

    // ── Proxy all remaining requests → Next.js dev server ────────────────────
    const nextProxy = createProxyMiddleware({
      target: `http://localhost:${NEXT_PORT}`,
      changeOrigin: true,
      ws: true, // proxy WebSocket (HMR in dev)
      on: {
        error(err, req, res) {
          console.error("[Proxy] Next.js not ready yet:", err.message);
          if (res && typeof res.status === "function" && !res.headersSent) {
            res.status(502).send("Frontend starting up — please refresh in a moment.");
          } else if (res && typeof res.writeHead === "function" && !res.headersSent) {
            res.writeHead(502, { "Content-Type": "text/plain" });
            res.end("Frontend starting up — please refresh in a moment.");
          }
        },
      },
    });

    app.use(nextProxy);

    // ── 404 for unmatched routes ──────────────────────────────────────────────
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: `API endpoint '${req.originalUrl}' not found on backend port ${PORT}.`,
      });
    });

    // ── Global error handler ──────────────────────────────────────────────────
    app.use((err, req, res, next) => {
      console.error("[Server Error]", err);
      res.status(err.status || 500).json({
        success: false,
        message:
          process.env.NODE_ENV === "production"
            ? "Internal server error"
            : err.message || "Internal server error",
      });
    });

    const server = app.listen(PORT, () => {
      console.log(`\n[Stampy] ✅  Running on http://localhost:${PORT}`);
      console.log(`[Stampy]    API  → http://localhost:${PORT}/api`);
      console.log(`[Stampy]    App  → http://localhost:${PORT}/\n`);
    });

    if (nextProxy.upgrade) {
      server.on("upgrade", nextProxy.upgrade);
    }
  } catch (error) {
    console.error("[Stampy Fatal Error]:", error);
    process.exit(1);
  }
}

startServer();
