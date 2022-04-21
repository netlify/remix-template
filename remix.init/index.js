const fs = require("fs");
const path = require("path");

module.exports = ({ isTypeScript, rootDirectory }) => {
  if (isTypeScript === false) {
    let remixConfigPath = path.join(rootDirectory, "remix.config.js");
    let remixConfig = require(remixConfigPath);
    remixConfig.server = "./server.js";

    let newConfig = `
/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = ${JSON.stringify(remixConfig, null, 2)}
`.trim();

    fs.writeFileSync(remixConfigPath, newConfig);
  }
};
