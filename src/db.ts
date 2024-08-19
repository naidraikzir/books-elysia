import { Database } from 'bun:sqlite'
import { DB_NAME } from '@/constants'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { books } from './schemas/books.schema'
import { collections } from './schemas/collections.schema'
import { collectionsOfBooks } from './schemas/collectionsOfBooks.schema'
import { users } from './schemas/users.schema'

const schema = {
  books,
  collections,
  collectionsOfBooks,
  users,
}

const sqlite = new Database(DB_NAME)
export const db = drizzle(sqlite, { schema })
