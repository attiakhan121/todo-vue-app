<script setup>
import { useTodoStore } from '../stores/todoStore'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const store = useTodoStore()
</script>

<template>
  <li class="flex items-center justify-between border-b py-2">
    <!-- toggle checkbox -->
    <div class="flex items-center gap-2">
      <input
        type="checkbox"
        v-model="props.task.done"
        @change="store.toggleTask(props.task.id)"
        class="cursor-pointer"
      />
      <span :class="props.task.done ? 'line-through text-gray-400' : ''">
        {{ props.task.text }}
      </span>
    </div>

    <!-- delete button -->
    <button
      @click="store.deleteTask(props.task.id)"
      class="text-red-500 hover:text-red-700"
    >
      ✕
    </button>
  </li>
</template>
