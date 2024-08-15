import { plugins } from '@/plugins'
import { Elysia } from 'elysia'

const app = new Elysia().use(plugins).listen(Bun.env.PORT || 3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)

export type ElysiaApp = typeof app
