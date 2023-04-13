const baseConfig =
  process.env.NODE_ENV === "production"
    ? // when running the Netify CLI or building on Netlify, we want to use
      {
        server: "./server.js",
        serverBuildPath: ".netlify/functions-internal/server.js",
      }
    : // otherwise support running remix dev, i.e. no custom server
      undefined;

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ...baseConfig,
  ignoredRouteFiles: ["**/.*"],
  // See https://remix.run/docs/en/main/file-conventions/route-files-v2
  future: {
    v2_routeConvention: true,
  }
  // add your own custom config here if you want to.
  //
  // See https://remix.run/docs/en/v1/file-conventions/remix-config
};
