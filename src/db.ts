import { Database } from 'bun:sqlite'
import { DB_NAME } from '@/constants'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as books from './schemas/books.schema'
import * as collections from './schemas/collections.schema'
import * as collectionsOfBooks from './schemas/collectionsOfBooks.schema'
import * as users from './schemas/users.schema'

const schema = {
  ...books,
  ...collections,
  ...collectionsOfBooks,
  ...users,
}

const sqlite = new Database(DB_NAME)
export const db = drizzle(sqlite, { schema })
