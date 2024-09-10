import { compression } from '@/lib/plugins/compression'
import { jwt } from '@elysiajs/jwt'
import { staticPlugin } from '@elysiajs/static'
import { swagger } from '@elysiajs/swagger'
import { logger } from '@tqman/nice-logger'
import { Elysia } from 'elysia'
import { autoload } from 'elysia-autoload'
import { rateLimit } from 'elysia-rate-limit'

if (!Bun.env.SECRET) throw new Error('SECRET not set!')

export const plugins = new Elysia()
  .use(
    rateLimit({
      max: 30,
    }),
  )
  .use(logger())
  .use(compression())
  .use(
    jwt({
      name: 'jwt',
      secret: Bun.env.SECRET as string,
      exp: '7d',
    }),
  )
  .use(
    staticPlugin({
      prefix: '/',
    }),
  )
  .use(
    await autoload({
      schema: ({ path, url }) => {
        // biome-ignore lint/style/noNonNullAssertion:
        const tag = url.split('/').at(0)!

        return {
          detail: {
            description: `Route autoloaded from ${path}`,
            tags: [`${tag.charAt(0).toUpperCase()}${tag.slice(1)}`],
          },
        }
      },
    }),
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Books Elysia',
          version: Bun.env.npm_package_version as string,
        },
      },
    }),
  )
  .onError(({ code }) => {
    if (code === 'NOT_FOUND') {
      return new Response(null, {
        status: 404,
      })
    }
  })
