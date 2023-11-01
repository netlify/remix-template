import * as build from "@remix-run/dev/server-build";
import { createRequestHandler } from "@netlify/remix-edge-adapter";
import { broadcastDevReady } from "@netlify/remix-runtime";

export default createRequestHandler({
  build,
  // process.env.NODE_ENV is provided by Remix at compile time
  mode: process.env.NODE_ENV,
});

if (process.env.NODE_ENV === "development") {
  // Tell remix dev that the server is ready
  broadcastDevReady(build);
}

export const config = {
  cache: "manual",
  path: "/*",
  // Let the CDN handle requests for static assets, i.e. ^/_assets/*$
  //
  // Add other exclusions here, e.g. "^/api/*$" for custom Netlify functions or
  // custom Netlify Edge Functions
  excludedPath: ["/build/*", "/favicon.ico"],
};
