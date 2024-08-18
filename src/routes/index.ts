import type { ElysiaApp } from '@/.'
import { t } from 'elysia'

export default (app: ElysiaApp) =>
  app.get('/', 'Hello Elysia', {
    response: {
      200: t.String({ default: 'Hello Elysia', description: 'OK' }),
    },
  })
