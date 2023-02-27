const baseConfig =
  process.env.NETLIFY || process.env.NETLIFY_LOCAL
    ? // when running the Netify CLI or building on Netlify, we want to use
      {
        serverBuildTarget: "netlify",
        server: "./server.js",
      }
    : // otherwise support running remix dev, i.e. no custom server
      undefined;

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ...baseConfig,
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: ".netlify/functions-internal/server.js",
  // publicPath: "/build/",
};
