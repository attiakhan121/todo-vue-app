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
      <button @click="addTask" class="bg-#535bf2 text-black px-4 rounded-r">
        Add
      </button>
    </div>

    <!-- filters & stats -->
    <div class="flex items-center justify-between text-sm text-gray-600 mb-3">
      <div>{{ remaining }} remaining</div>
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
        @toggle="toggleTask"
        @delete="deleteTask"
      />
    </ul>

    <!-- footer actions -->
    <div class="flex justify-between items-center mt-4 text-sm">
      <button @click="clearCompleted" class="text-red-500">Clear completed</button>
      <button @click="saveToFile" class="text-blue-600">Export JSON</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import TodoItem from './TodoItem.vue'

const newTask = ref('')
const tasks = ref([])
const filter = ref('all')

// load tasks from localStorage
onMounted(() => {
  const raw = localStorage.getItem('todo-vue-tasks')
  tasks.value = raw ? JSON.parse(raw) : []
})

// add task
const addTask = () => {
  const text = newTask.value.trim()
  if (!text) return
  tasks.value.unshift({
    id: Date.now(),
    text,
    done: false,
    createdAt: new Date().toISOString()
  })
  newTask.value = ''
}

// toggle done
const toggleTask = (id) => {
  const t = tasks.value.find(x => x.id === id)
  if (t) t.done = !t.done
}

// delete
const deleteTask = (id) => {
  tasks.value = tasks.value.filter(x => x.id !== id)
}

// clear completed
const clearCompleted = () => {
  tasks.value = tasks.value.filter(x => !x.done)
}

// computed remaining
const remaining = computed(() => tasks.value.filter(t => !t.done).length)

// filtered tasks
const filteredTasks = computed(() => {
  if (filter.value === 'active') return tasks.value.filter(t => !t.done)
  if (filter.value === 'done') return tasks.value.filter(t => t.done)
  return tasks.value
})

// persist into localStorage when tasks change
watch(tasks, (val) => {
  localStorage.setItem('todo-vue-tasks', JSON.stringify(val))
}, { deep: true })

// small helper to export tasks
const saveToFile = () => {
  const blob = new Blob([JSON.stringify(tasks.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'todo-export.json'
  a.click()
  URL.revokeObjectURL(url)
}

const btnClass = (name) => {
  return [
    'px-2 py-1 rounded ',
    filter.value === name ? 'bg-gray-200' : 'hover:bg-gray-50'
  ].join(' ')
}
</script>
