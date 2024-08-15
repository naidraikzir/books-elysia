import type { ElysiaApp } from '@/.'

export default (app: ElysiaApp) =>
  app.get('', ({ params: { id } }) => `Book ${id}`)
