<script setup lang="ts">
defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  type?: string
  id?: string
  disabled?: boolean
  error?: string | boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
  'blur': [event: FocusEvent]
}>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="id" class="text-sm font-medium text-gray-600">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="type ?? 'text'"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full px-4 py-3 bg-white border rounded-lg text-sm text-gray-800 placeholder-gray-400
               focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
        :class="[
          error 
            ? 'border-red-400 focus:ring-red-300 focus:border-red-400' 
            : 'border-gray-200 focus:ring-kambista-teal/40 focus:border-kambista-teal'
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
      />
      <slot name="suffix"></slot>
    </div>
  </div>
</template>
