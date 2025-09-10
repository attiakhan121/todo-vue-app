<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
      <h1 class="text-2xl font-semibold text-center mb-4">Todo — Vue + Vite + Tailwind</h1>
      <TodoList />
    </div>
  </div>
</template>

<script setup>
import TodoList from './components/TodoList.vue'
</script>
