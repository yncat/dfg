import { execSync } from "child_process";
import fs from "fs";
const versionHash = execSync("git rev-parse --short HEAD")
  .toString()
  .trim();
const builtAt = new Date().toLocaleString();
const content = [
  "export const versionHash = '" + versionHash + "';",
  "export const builtAt = '" + builtAt + "';",
];

fs.writeFileSync("src/versionInfo.ts", content.join("\n"));
