import { PassThrough } from 'node:stream'

import type { AppLoadContext, EntryContext } from '@remix-run/node'
import { createReadableStreamFromReadable } from './stream'
import { RemixServer } from '@remix-run/react'
import isbot from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'

const ABORT_DELAY = 5_000

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext,
) {
  const bot = isbot(request.headers.get('user-agent'))
  return new Promise((resolve, reject) => {
    let shellRendered = false
    const body = new PassThrough()
    const stream = createReadableStreamFromReadable(body)

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />,
      {
        onShellReady() {
          if (!bot) {
            shellRendered = true
            responseHeaders.set('Content-Type', 'text/html')
            resolve(
              new Response(stream, {
                headers: responseHeaders,
                status: responseStatusCode,
              }),
            )
            pipe(body)
          }
        },
        onShellError(error: unknown) {
          reject(error)
        },
        onAllReady() {
          clearTimeout(timer)
          if (bot) {
            shellRendered = true
            responseHeaders.set('Content-Type', 'text/html')
            resolve(
              new Response(stream, {
                headers: responseHeaders,
                status: responseStatusCode,
              }),
            )
            pipe(body)
          }
        },
        onError(error: unknown) {
          responseStatusCode = 500
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error)
          }
        },
      },
    )

    const timer = setTimeout(() => {
      console.log('aborting')
      abort()
    }, ABORT_DELAY)
  })
}
