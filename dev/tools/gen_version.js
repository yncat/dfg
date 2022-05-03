const child_process = require("child_process");
const fs = require("fs");
const versionHash = child_process
  .execSync("git rev-parse --short HEAD")
  .toString()
  .trim();
const builtAt = new Date().toLocaleString();
const content = [
  "export const versionHash = '" + versionHash + "';",
  "export const builtAt = '" + builtAt + "';",
];

fs.writeFileSync("src/versionInfo.ts", content.join("\n"));
