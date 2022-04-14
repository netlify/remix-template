/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  serverBuildTarget: "netlify-edge",
  server: "./server.ts",
  ignoredRouteFiles: [".*"],
};
