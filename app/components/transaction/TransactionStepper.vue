<script setup lang="ts">
defineProps<{
  currentStep: 1 | 2 | 3
}>()

const steps = [
  { step: 1 as const, label: 'Completa' },
  { step: 2 as const, label: 'Transfiere' },
  { step: 3 as const, label: 'Envía constancia' },
]
</script>

<template>
  <nav class="flex flex-1 items-center justify-center px-2" aria-label="Pasos de la operación">
    <ol class="flex max-w-full items-center gap-0 sm:gap-1">
      <li
        v-for="(item, index) in steps"
        :key="item.step"
        class="flex min-w-0 items-center"
      >
        <span class="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <span
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold sm:h-8 sm:w-8 sm:text-xs"
            :class="
              currentStep === item.step
                ? 'border-[#0c1e3f] bg-[#0c1e3f] text-white'
                : currentStep > item.step
                  ? 'border-[#0c1e3f] bg-white text-[#0c1e3f]'
                  : 'border-[#d5dae3] bg-white text-[#9aa3b2]'
            "
            :aria-current="currentStep === item.step ? 'step' : undefined"
          >
            {{ item.step }}
          </span>
          <span
            class="hidden max-w-[5.5rem] truncate text-[11px] font-semibold leading-tight text-[#1a253f] sm:inline sm:max-w-none sm:text-[12px]"
            :class="currentStep === item.step ? 'text-[#0a1325]' : 'text-[#6b7280]'"
          >
            {{ item.label }}
          </span>
        </span>
        <span
          v-if="index < steps.length - 1"
          class="mx-1 h-px w-4 shrink-0 bg-[#d5dae3] sm:mx-2 sm:w-8"
          aria-hidden="true"
        />
      </li>
    </ol>
  </nav>
</template>
