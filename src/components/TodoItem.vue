<script setup>
import { useTodoStore } from '../stores/todoStore'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const store = useTodoStore()

// toggle task
const toggle = () => {
  store.toggleTask(props.task.id)
}

// delete task
const remove = () => {
  store.deleteTask(props.task.id)
}
</script>

<template>
  <li class="flex items-center justify-between border-b py-2">
    <!-- toggle checkbox -->
    <div class="flex items-center gap-2">
      <input
        type="checkbox"
        :checked="props.task.done"
        @change="toggle"
        class="cursor-pointer"
      />
      <span :class="props.task.done ? 'line-through text-gray-400' : ''">
        {{ props.task.text }}
      </span>
    </div>

    <!-- delete button -->
    <button
      @click="remove"
      class="text-red-500 hover:text-red-700"
    >
      ✕
    </button>
  </li>
</template>
