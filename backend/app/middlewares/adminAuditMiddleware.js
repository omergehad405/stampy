const AdminAuditLog = require("../models/AdminAuditLog");

const RESOURCE_NAMES = {
  cafes: "cafe",
  customers: "customer",
  plans: "subscription plan",
  announcements: "announcement",
  settings: "platform settings",
  auth: "admin account",
};

const adminAuditMiddleware = (req, res, next) => {
  if (
    ["GET", "HEAD", "OPTIONS"].includes(req.method) ||
    req.user?.role !== "admin"
  ) {
    return next();
  }

  const sendJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode < 200 || res.statusCode >= 300 || !req.user) {
      return sendJson(body);
    }
    const resource = RESOURCE_NAMES[req.baseUrl.split("/").pop()] || "platform";
    const action =
      req.path === "/assign"
        ? "assigned"
        : req.path === "/change-password"
          ? "changed password for"
          : req.method === "POST"
            ? "created"
            : req.method === "DELETE"
              ? "deleted"
              : req.path.endsWith("/status")
                ? "changed status for"
                : "updated";
    const requestBody = req.body || {};
    const resourceId = req.params.id || requestBody.cafeId || "";

    return AdminAuditLog.create({
      adminId: req.user._id,
      adminName: req.user.name,
      action,
      resource,
      description:
        req.path === "/assign"
          ? `${req.user.name} assigned a subscription plan to cafe ${requestBody.cafeId || ""}`.trim()
          : `${req.user.name} ${action} ${resource}${resourceId ? ` ${resourceId}` : ""}`,
      metadata: {
        method: req.method,
        path: `${req.baseUrl}${req.path}`,
        statusCode: res.statusCode,
        ...(resourceId ? { resourceId: String(resourceId) } : {}),
        ...(requestBody.cafeId ? { cafeId: String(requestBody.cafeId) } : {}),
        ...(requestBody.planId ? { planId: String(requestBody.planId) } : {}),
      },
    })
      .then(() => sendJson(body))
      .catch((error) => {
        console.error("[Admin Audit] Failed to record admin action:", error);
        return sendJson(body);
      });
  };

  next();
};

module.exports = adminAuditMiddleware;
