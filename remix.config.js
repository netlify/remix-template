/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ['**/.*'],
  server: './server.ts',
  serverBuildPath: './.netlify/functions-internal/server.mjs',
  serverModuleFormat: 'esm',
}
