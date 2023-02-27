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
  // add your own custom config here if you want to.
  //
  // See https://remix.run/docs/en/v1/file-conventions/remix-config
};
