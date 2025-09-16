import { defineStore } from 'pinia'
import { saveTodos, loadTodos, clearTodos } from '../utils/db'
import axios from 'axios'

// ✅ Space handle with %20
const API_BASE = 'http://127.0.0.1:8000/api/resource/Todo%20item'
const API_KEY = '169432fa1d8ab23'
const API_SECRET = '670fd3f346c0483'

const apiHeaders = {
  'Authorization': `token ${API_KEY}:${API_SECRET}`
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: []
  }),

  getters: {
    remaining: (state) => state.todos.filter(t => !t.done).length,
    activeTasks: (state) => state.todos.filter(t => !t.done),
    completedTasks: (state) => state.todos.filter(t => t.done),
  },

  actions: {
    // 🟢 Init todos: sirf backend se fresh load (Doctype change hone k baad yeh best hai)
    async init() {
      try {
        // 1. Clear local cache
        await clearTodos()
        this.todos = []

        // 2. Load from backend
        const res = await axios.get(API_BASE, { headers: apiHeaders })
        this.todos = res.data.data.map(item => ({
          id: Date.now() + Math.random(),
          frappe_id: item.name,
          text: item.description,
          done: item.status === 'Closed',
          createdAt: item.creation
        }))

        // 3. Save fresh data to local cache
        await this.persist()
      } catch (err) {
        console.warn("⚠️ Backend fetch failed:", err)
      }
    },

    // 🟢 Persist to IndexedDB
    async persist() {
      await saveTodos(this.todos)
    },

    // 🟢 Add task
    async addTask(text) {
      const task = {
        id: Date.now(),
        text,
        done: false,
        createdAt: new Date().toISOString(),
        frappe_id: null
      }
      this.todos.unshift(task)
      await this.persist()
    },

    // 🟢 Toggle task done/undone
    async toggleTask(id) {
      const t = this.todos.find(x => x.id === id)
      if (!t) return

      t.done = !t.done
      await this.persist()

      if (t.frappe_id) {
        try {
          await axios.put(`${API_BASE}/${t.frappe_id}`, {
            description: t.text,
            status: t.done ? 'Closed' : 'Open'
          }, { headers: apiHeaders })
        } catch (err) {
          console.error("❌ Toggle sync failed:", err)
        }
      }
    },

    // 🟢 Delete task
    async deleteTask(id) {
      const t = this.todos.find(x => x.id === id)
      this.todos = this.todos.filter(x => x.id !== id)
      await this.persist()

      if (t?.frappe_id) {
        try {
          await axios.delete(`${API_BASE}/${t.frappe_id}`, { headers: apiHeaders })
        } catch (err) {
          console.error("❌ Delete sync failed:", err)
        }
      }
    },

    // 🟢 Clear completed tasks
    async clearCompleted() {
      const completed = this.todos.filter(x => x.done)
      this.todos = this.todos.filter(x => !x.done)
      await this.persist()

      for (const t of completed) {
        if (t.frappe_id) {
          try {
            await axios.delete(`${API_BASE}/${t.frappe_id}`, { headers: apiHeaders })
          } catch (err) {
            console.error("❌ ClearCompleted sync failed:", err)
          }
        }
      }
    },

    // 🟢 Clear all tasks
    async clearAll() {
      const all = [...this.todos]
      this.todos = []
      await clearTodos()

      for (const t of all) {
        if (t.frappe_id) {
          try {
            await axios.delete(`${API_BASE}/${t.frappe_id}`, { headers: apiHeaders })
          } catch (err) {
            console.error("❌ ClearAll sync failed:", err)
          }
        }
      }
    },

    // 🟢 Full Sync (local → backend)
    async syncTodos() {
      for (const todo of this.todos) {
        try {
          if (!todo.frappe_id) {
            // create new in Frappe
            const res = await axios.post(API_BASE, {
              description: todo.text,
              status: todo.done ? 'Closed' : 'Open'
            }, { headers: apiHeaders })

            todo.frappe_id = res.data.data.name
          } else {
            // update existing in Frappe
            await axios.put(`${API_BASE}/${todo.frappe_id}`, {
              description: todo.text,
              status: todo.done ? 'Closed' : 'Open'
            }, { headers: apiHeaders })
          }
        } catch (err) {
          console.error("❌ Sync failed for todo:", todo, err)
        }
      }
      await this.persist()
      alert('✅ Sync completed!')
    }
  }
})
