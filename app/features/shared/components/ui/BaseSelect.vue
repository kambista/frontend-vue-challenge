<script setup lang="ts">
interface Option {
  value: string | number;
  label: string;
}

interface Props {
  modelValue?: string | number | undefined | null;
  name: string;
  label?: string;
  options: Option[];
  placeholder?: string;
  error?: string;
}

defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="w-full flex flex-col gap-1.5 text-left">
    <label v-if="label" :for="name" class="text-sm text-gray-500 mb-1">
      {{ label }}
    </label>
    
    <div class="relative">
      <select
        :id="name"
        :value="modelValue || ''"
        @change="onChange"
        class="w-full border rounded-lg appearance-none py-3 px-4 bg-white outline-none transition-colors cursor-pointer"
        :class="[
          error 
            ? 'border-red-500 text-red-500 focus:ring-1 focus:ring-red-500' 
            : 'border-gray-300 text-gray-600 focus:border-kambista-cyan focus:ring-1 focus:ring-kambista-cyan',
          !modelValue ? 'text-gray-400' : ''
        ]"
      >
        <option value="" disabled hidden>{{ placeholder || 'Selecciona una opción' }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value" class="text-gray-600">
          {{ option.label }}
        </option>
      </select>
      
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
    
    <span v-if="error" class="text-xs text-red-500 mt-0.5">{{ error }}</span>
  </div>
</template>