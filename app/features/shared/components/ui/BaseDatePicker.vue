<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: Date | string | null;
  name: string;
  label?: string;
  placeholder?: string;
  error?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const dateValue = computed({
  get: () => {
    if (!props.modelValue) return null;
    
    if (typeof props.modelValue === 'string') {
      const [day, month, year] = props.modelValue.split('-');
      if (day && month && year) {
        return new Date(Number(year), Number(month) - 1, Number(day));
      }
    }
    return props.modelValue;
  },
  set: (val: any) => {
    if (!val) {
      emit('update:modelValue', '');
      return;
    }
    
    if (val instanceof Date) {
      const day = val.getDate().toString().padStart(2, '0');
      const month = (val.getMonth() + 1).toString().padStart(2, '0');
      const year = val.getFullYear();
      
      emit('update:modelValue', `${day}-${month}-${year}`); // Emitimos "DD-MM-YYYY"
    } else {
      emit('update:modelValue', val);
    }
  }
});
</script>

<template>
  <div class="w-full flex flex-col gap-1.5 text-left">
    <label v-if="label" :for="name" class="text-sm text-gray-500 mb-1">
      {{ label }}
    </label>
    
    <ClientOnly>
      <VDatePicker 
        v-model="dateValue" 
        locale="es"
        color="teal" 
        :popover="{ placement: 'bottom', visibility: 'click' }"
      >
        <template #default="{ inputValue, inputEvents }">
          <div class="relative">
            <input
              :id="name"
              :value="inputValue"
              v-on="inputEvents"
              :placeholder="placeholder || 'dd-mm-aaaa'"
              readonly
              class="w-full border rounded-lg py-3 px-4 bg-white outline-none transition-colors cursor-pointer text-gray-600"
              :class="[
                error 
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-kambista-cyan focus:ring-1 focus:ring-kambista-cyan',
                !inputValue ? 'text-gray-400' : ''
              ]"
            />
            
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </template>
      </VDatePicker>
    </ClientOnly>
    
    <span v-if="error" class="text-xs text-red-500 mt-0.5">{{ error }}</span>
  </div>
</template>

<style>
:root {
  --vc-accent-600: #00e3c2;
  --vc-accent-500: #00e3c2;
  --vc-accent-900: #00b399;
}
</style>