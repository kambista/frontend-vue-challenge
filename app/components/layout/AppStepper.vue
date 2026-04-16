<template>
  <nav class="flex items-center gap-0" aria-label="Progreso de operación">
    <template v-for="(step, index) in steps" :key="step.key">
      <div class="flex flex-col items-center gap-1">
        <div
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
            currentStep > index + 1
              ? 'bg-[#111760] text-white'
              : currentStep === index + 1
                ? 'bg-[#111760] text-white'
                : 'bg-gray-300 text-gray-500',
          ]"
          :aria-current="currentStep === index + 1 ? 'step' : undefined"
        >
          <svg
            v-if="currentStep > index + 1"
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span v-else class="text-xs">{{ index + 1 }}</span>
        </div>
        <span
          :class="[
            'text-[10px] sm:text-xs whitespace-nowrap font-medium mt-1 hidden sm:block',
            currentStep >= index + 1 ? 'text-[#111760] font-semibold' : 'text-gray-400',
          ]"
        >{{ step.label }}</span>
        <!-- Mobile only current label -->
        <span 
          v-if="currentStep === index + 1"
          class="text-[10px] whitespace-nowrap font-semibold text-[#111760] mt-1 sm:hidden"
        >
          {{ step.label }}
        </span>
      </div>
      <div
        v-if="index < steps.length - 1"
        :class="['h-0.5 w-6 sm:w-12 mx-1 sm:mx-2 mb-4 sm:mb-6 shrink', currentStep > index + 1 ? 'bg-[#111760]' : 'bg-gray-300']"
        aria-hidden="true"
      />
    </template>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{ currentStep: 1 | 2 | 3 }>()

const steps = [
  { key: 'completa', label: 'Completa' },
  { key: 'transfiere', label: 'Transfiere' },
  { key: 'constancia', label: 'Envía constancia' },
]
</script>
