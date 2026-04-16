<script setup lang="ts">
defineProps<{
  modelValue?: boolean
  id?: string
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <label :for="id" class="flex items-start gap-3 cursor-pointer group">
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      class="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 cursor-pointer
             accent-kambista-teal focus:ring-kambista-teal"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="text-sm text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
      <slot />
    </span>
  </label>
</template>
