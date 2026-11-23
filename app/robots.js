export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/how-it-works",
          "/features",
          "/pricing",
          "/contact",
          "/privacy",
          "/terms",
        ],
        disallow: [
          "/dashboard",
          "/admin",
          "/home",
          "/profile",
          "/my-cafes",
          "/cafe/",
          "/login",
          "/forgot-password",
          "/reset-password",
          "/api/",
        ],
      },
    ],
    sitemap: "https://notchloyalty.com/sitemap.xml",
  };
}
