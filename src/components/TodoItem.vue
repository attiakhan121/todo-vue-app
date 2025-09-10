<template>
  <li class="flex items-center justify-between py-2 border-b last:border-b-0">
    <div class="flex items-center gap-3">
      <input type="checkbox" :checked="task.done" @change="$emit('toggle', task.id)" />
      <div>
        <div :class="{ 'line-through text-gray-400': task.done }" class="font-medium">
          {{ task.text }}
        </div>
        <div class="text-xs text-gray-400">{{ formattedDate }}</div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button @click="$emit('delete', task.id)" class="text-red-500" title="Delete">✕</button>
    </div>
  </li>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({
  task: { type: Object, required: true }
})

const formattedDate = computed(() => {
  return new Date(props.task.createdAt).toLocaleString()
})

// small demo of lifecycle hooks (for learning)
onMounted(() => {
  // console.log('TodoItem mounted:', props.task.id)
})
onBeforeUnmount(() => {
  // console.log('TodoItem will unmount:', props.task.id)
})
</script>
