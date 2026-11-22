const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const skipDirs = new Set(["node_modules", ".next", ".git", "dist", "coverage"]);
const exts = new Set([".js", ".jsx", ".ts", ".tsx", ".md", ".json", ".html", ".css", ".svg", ".txt"]);
const changed = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!exts.has(path.extname(entry.name))) continue;
    if (full === __filename) continue;

    const original = fs.readFileSync(full, "utf8");
    if (!original.includes("Stampy")) continue;

    let content = original;
    const protections = [];
    const protect = (re) => {
      content = content.replace(re, (match) => {
        const token = `__KEEP${protections.length}__`;
        protections.push(match);
        return token;
      });
    };

    protect(/HowStampyWorks/g);
    protect(/Stampy_/g);
    protect(/Stampy2026/g);
    protect(/27017\/Stampy/g);

    content = content.replace(/Stampy/g, "Notch");
    content = content.replace(/@Notch\.app/g, "@notch.app");
    content = content.replace(/@Notch\.io/g, "@notch.io");

    protections.forEach((value, index) => {
      content = content.split(`__KEEP${index}__`).join(value);
    });

    if (entry.name === "package.json" || entry.name === "package-lock.json") {
      content = content.replace(/"name": "Notch"/g, '"name": "notch"');
    }

    if (content !== original) {
      try {
        fs.writeFileSync(full, content);
        changed.push(path.relative(root, full));
      } catch (error) {
        console.error("FAILED", full, error.code || error.message);
      }
    }
  }
}

walk(root);
console.log(changed.join("\n"));
console.log("COUNT", changed.length);
