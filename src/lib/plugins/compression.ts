import { gzipSync } from 'bun'
import type { Elysia } from 'elysia'

const encoder = new TextEncoder()

export const compression = (app: Elysia) =>
  app.mapResponse(({ response, set }) => {
    if (response instanceof Response) {
      return response
    }

    const text = JSON.stringify(response)
    set.headers['Content-Encoding'] = 'gzip'

    return new Response(gzipSync(encoder.encode(text)), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  })
