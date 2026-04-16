<script setup lang="ts">
interface Props {
  modelValue: boolean | undefined | null;
  name: string;
}
defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
};
</script>

<template>
  <div class="flex items-start gap-3">
    <div class="flex items-center h-5">
      <input 
        :id="name" 
        type="checkbox" 
        :checked="!!modelValue"
        @change="onChange"
        class="w-4 h-4 border border-gray-300 rounded bg-white focus:ring-kambista-cyan text-kambista-cyan cursor-pointer transition-colors"
      />
    </div>
    <label :for="name" class="text-xs text-gray-500 leading-tight cursor-pointer select-none">
      <slot />
    </label>
  </div>
</template>