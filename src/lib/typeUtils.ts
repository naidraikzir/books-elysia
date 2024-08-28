import { t } from 'elysia'

export const SortDir = t.Union([t.Literal('asc'), t.Literal('desc')])
