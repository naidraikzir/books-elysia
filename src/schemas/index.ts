import * as books from './books.schema'
import * as collections from './collections.schema'
import * as collectionsOfBooks from './collectionsOfBooks.schema'
import * as users from './users.schema'

export const schema = {
  ...books,
  ...collections,
  ...collectionsOfBooks,
  ...users,
}
