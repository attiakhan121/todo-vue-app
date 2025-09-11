import { openDB } from 'idb'

const DB_NAME = 'todoDB'
const STORE_NAME = 'todos'

// ---------------------------
// Helper: Sanitize todo
// ---------------------------
function sanitizeTodo(todo) {
  return {
    id: todo.id,
    text: todo.text || '',
    done: !!todo.done,
    createdAt: todo.createdAt || new Date().toISOString(),
    frappe_id: todo.frappe_id || null
  }
}

// ---------------------------
// Open or create DB
// ---------------------------
export async function getDb() {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

// ---------------------------
// Utility for transactions
// ---------------------------
async function withStore(type, callback) {
  const db = await getDb()
  const tx = db.transaction(STORE_NAME, type)
  const result = await callback(tx.store)
  await tx.done
  return result
}

// ---------------------------
// CRUD operations
// ---------------------------

// ✅ Add or update single todo
export async function saveTodo(todo) {
  return withStore('readwrite', (store) => store.put(sanitizeTodo(todo)))
}

// ✅ Save multiple todos (bulk)
export async function saveTodos(todos) {
  return withStore('readwrite', async (store) => {
    for (const todo of todos) {
      await store.put(sanitizeTodo(todo))
    }
  })
}

// ✅ Get all todos
export async function loadTodos() {
  return withStore('readonly', (store) => store.getAll())
}

// ✅ Get single todo by id
export async function loadTodo(id) {
  return withStore('readonly', (store) => store.get(id))
}

// ✅ Delete todo by id
export async function deleteTodo(id) {
  return withStore('readwrite', (store) => store.delete(id))
}

// ✅ Clear all todos
export async function clearTodos() {
  return withStore('readwrite', (store) => store.clear())
}
