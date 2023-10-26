import * as build from '@remix-run/dev/server-build'
import { createRequestHandler } from '@netlify/remix-adapter'
import type { Context, Config } from '@netlify/functions'

const handle = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
})

export default function handler(request: Request, context: Context) {
  return handle(request, context)
}

