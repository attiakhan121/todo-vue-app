<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import TodoItem from './TodoItem.vue'

const store = useTodoStore()
const newTask = ref('')
const filter = ref('all')

// init store on mount
onMounted(() => {
  store.init()
})

// add task
const addTask = () => {
  const text = newTask.value.trim()
  if (!text) return
  store.addTask(text)
  newTask.value = ''
}

// filtered tasks
const filteredTasks = computed(() => {
  if (filter.value === 'active') return store.activeTasks
  if (filter.value === 'done') return store.completedTasks
  return store.todos
})

// export JSON
const saveToFile = () => {
  const blob = new Blob([JSON.stringify(store.todos, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'todo-export.json'
  a.click()
  URL.revokeObjectURL(url)
}

const btnClass = (name) => {
  return [
    'px-2 py-1 rounded',
    filter.value === name ? 'bg-gray-200' : 'hover:bg-gray-50'
  ].join(' ')
}
</script>

<template>
  <div>
    <!-- input -->
    <div class="flex gap-2 mb-4">
      <input
        v-model="newTask"
        @keyup.enter="addTask"
        type="text"
        placeholder="Add new task..."
        class="flex-1 border rounded-l px-3 py-2 focus:outline-none focus:ring"
      />
      <button @click="addTask" class="bg-[#535bf2] text-white px-4 rounded-r">
        Add
      </button>
    </div>

    <!-- filters & stats -->
    <div class="flex items-center justify-between text-sm text-gray-600 mb-3">
      <div>{{ store.remaining }} remaining</div>
      <div class="flex gap-2">
        <button @click="filter = 'all'" :class="btnClass('all')">All</button>
        <button @click="filter = 'active'" :class="btnClass('active')">Active</button>
        <button @click="filter = 'done'" :class="btnClass('done')">Done</button>
      </div>
    </div>

    <!-- empty state -->
    <div v-if="filteredTasks.length === 0" class="text-center text-gray-400 py-8">
      No tasks yet — add your first task!
    </div>

    <!-- list -->
    <ul>
      <TodoItem
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @toggle="store.toggleTask(task.id)"
        @delete="store.deleteTask(task.id)"
      />
    </ul>

    <!-- footer actions -->
    <div class="flex justify-between items-center mt-4 text-sm">
      <button @click="store.clearCompleted" class="text-red-500">Clear completed</button>
      <button @click="saveToFile" class="text-blue-600">Export JSON</button>
    </div>
  </div>
</template>
