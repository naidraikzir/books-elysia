import { bearer } from '@elysiajs/bearer'
import { jwt } from '@elysiajs/jwt'
import { staticPlugin } from '@elysiajs/static'
import { swagger } from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import { autoload } from 'elysia-autoload'

if (!Bun.env.SECRET) throw new Error('SECRET not set!')

export const plugins = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: Bun.env.SECRET as string,
    }),
  )
  .use(bearer())
  .use(staticPlugin())
  .use(
    await autoload({
      schema: ({ path, url }) => {
        // biome-ignore lint/style/noNonNullAssertion:
        const tag = url.split('/').at(0)!

        return {
          beforeHandle: ({ request }) => {
            console.log(request.url)
          },
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
