import { openDB } from 'idb'

const DB_NAME = 'todoDB'
const STORE_NAME = 'todos'

export async function getDb() {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

export async function saveTodos(todos) {
  const db = await getDb()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  await Promise.all(todos.map(todo => tx.store.put(todo)))
  await tx.done
}

export async function loadTodos() {
  const db = await getDb()
  return await db.getAll(STORE_NAME)
}

export async function clearTodos() {
  const db = await getDb()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  await tx.store.clear()
  await tx.done
}
