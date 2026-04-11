<script setup lang="ts">
interface Props {
  modelValue: string | number | undefined | null;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  name: string;
}

defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="w-full">
    <label 
      v-if="label" 
      :for="name" 
      class="block text-sm font-medium text-gray-600 mb-1.5"
    >
      {{ label }}
    </label>

    <div class="relative">
      <input
        :id="name"
        :type="type || 'text'"
        :value="modelValue"
        :placeholder="placeholder"
        @input="onInput"
        class="w-full px-4 py-3 bg-white rounded-lg border transition-all outline-none"
        :class="[
          error 
            ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500' 
            : 'border-gray-300'
        ]"
      />
      
      <div class="absolute right-4 top-1/2 -translate-y-1/2">
        <slot name="suffix" />
      </div>
    </div>

    <p v-if="error" class="mt-1.5 text-xs text-red-500 font-medium">
      {{ error }}
    </p>
  </div>
</template>