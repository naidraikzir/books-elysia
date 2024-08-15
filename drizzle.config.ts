import { DB_NAME } from '@/constants'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/schemas/*.schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: `./${DB_NAME}`,
  },
})
