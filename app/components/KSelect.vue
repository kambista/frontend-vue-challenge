<script setup lang="ts">
defineProps<{
  modelValue?: string
  placeholder?: string
  options: { value: string; label: string }[]
  id?: string
  error?: string | boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="relative">
    <select
      :id="id"
      :value="modelValue"
      class="w-full px-4 py-3 bg-white border rounded-lg text-sm text-gray-800
             focus:outline-none focus:ring-2 transition-all cursor-pointer pr-9"
      :class="[
        error 
          ? 'border-red-400 focus:ring-red-300 focus:border-red-400' 
          : 'border-gray-200 focus:ring-kambista-teal/40 focus:border-kambista-teal'
      ]"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="" disabled selected class="text-gray-400">{{ placeholder ?? 'Seleccionar' }}</option>
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
        class="text-gray-800"
      >
        {{ opt.label }}
      </option>
    </select>
    <!-- Custom arrow -->
    <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</template>
