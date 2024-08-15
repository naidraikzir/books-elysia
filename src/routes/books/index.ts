import type { ElysiaApp } from '@/.'

export default (app: ElysiaApp) => app.get('', () => ['book 1', 'book 2'])
