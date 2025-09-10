import { defineStore } from 'pinia'

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
    init() {
      const raw = localStorage.getItem('todo-vue-tasks')
      this.todos = raw ? JSON.parse(raw) : []
    },
    persist() {
      localStorage.setItem('todo-vue-tasks', JSON.stringify(this.todos))
    },
    addTask(text) {
      const task = {
        id: Date.now(),
        text,
        done: false,
        createdAt: new Date().toISOString()
      }
      this.todos.unshift(task)
      this.persist()
    },
    toggleTask(id) {
      const t = this.todos.find(x => x.id === id)
      if (t) {
        t.done = !t.done
        this.persist()
      }
    },
    deleteTask(id) {
      this.todos = this.todos.filter(x => x.id !== id)
      this.persist()
    },
    clearCompleted() {
      this.todos = this.todos.filter(x => !x.done)
      this.persist()
    }
  }
})
