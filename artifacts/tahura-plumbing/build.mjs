/**
 * Static site build script for Vercel deployment.
 * Copies the static HTML/CSS/JS/assets into dist/ with no transformations.
 * Zero npm dependencies — uses Node.js built-ins only.
 */
import { cpSync, mkdirSync, rmSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, "dist");

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const copy = (src, dest) =>
  cpSync(join(__dirname, src), join(dist, dest), { recursive: true });

copy("index.html", "index.html");
copy("css",        "css");
copy("js",         "js");
copy("assets",     "assets");

console.log("✅ Build complete → dist/");
