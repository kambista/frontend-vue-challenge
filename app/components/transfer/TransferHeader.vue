<template>
  <header class="w-full bg-white border-b border-gray-100">
    <!-- Title row -->
    <div class="relative flex items-center justify-between px-4 sm:px-8 py-4">
      <!-- Left side: Kambista logo -->
      <img src="/images/logo-kambista-sinfondo-variante.png" alt="Kambista" class="h-7 sm:h-8 block scale-150" onerror="this.style.display='none'" />
      
      <!-- Center: Title (hidden on small screens to avoid crowding) -->
      <!-- <h1 class="absolute left-1/2 -translate-x-1/2 text-center text-base font-semibold text-[#1A1A2E] hidden md:block">
        {{ stepTitles[currentStep] }}
      </h1> -->

         <!-- Stepper row -->
    <nav class="flex items-center justify-center flex-1 mx-2 sm:mx-6 overflow-visible" aria-label="Pasos del flujo">
      <template v-for="(step, index) in steps" :key="step.key">
        <div class="flex flex-col items-center">
          <div
            class="stepper-dot"
            :class="index <= currentStep ? 'stepper-dot--active' : ''"
          />
          <span
            class="text-[10px] sm:text-xs mt-1 font-medium transition-colors duration-500 whitespace-nowrap"
            :class="index <= currentStep ? 'text-[#060f26]' : 'text-[#cccccc]'"
          >
            {{ step.label }}
          </span>
        </div>
        <div
          v-if="index < steps.length - 1"
          class="stepper-line mb-4 mx-1 sm:mx-2 flex-shrink"
          :class="index < currentStep ? 'stepper-line--active' : ''"
        />
      </template>
    </nav>

      <!-- Right side: Volver -->
      <button
        class="flex items-center gap-1 sm:gap-2 text-[#00D4C8] hover:text-[#00BFB4] transition-colors font-bold text-xs sm:text-sm shrink-0"
        aria-label="Volver"
        @click="$emit('back')"
      >
        <svg class="hidden sm:block" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span class="hidden sm:inline">Volver</span>
        <span class="sm:hidden font-extrabold text-lg leading-none">‹</span>
      </button>
    </div>

  </header>
</template>

<script setup lang="ts">
defineProps<{
  currentStep: number // 0 = Completa, 1 = Transfiere, 2 = Constancia
}>()

defineEmits<{
  back: []
}>()

const steps = [
  { key: 'completa', label: 'Completa' },
  { key: 'transfiere', label: 'Transfiere' },
  { key: 'constancia', label: 'Constancia' },
]

const stepTitles = ['Completa', 'Transfiere a Kambista', 'Envía tu constancia']
</script>

<style scoped>
.title-operacion {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-style: bold;
  font-size: 24px;
  line-height: 20px;
  color: #060f26;
}

.stepper-dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background-color: #cccccc;
  transition: background-color 0.5s ease, transform 0.4s ease, box-shadow 0.4s ease;
}
@media (min-width: 640px) {
  .stepper-dot {
    width: 12px;
    height: 12px;
  }
}

.stepper-dot--active {
  background-color: #060f26;
  transform: scale(1.25);
  box-shadow: 0 0 0 3px rgba(6, 15, 38, 0.15);
}

.stepper-line {
  height: 2px;
  width: 1.5rem;
  background-color: #cccccc;
  transition: background-color 0.5s ease;
}
@media (min-width: 640px) {
  .stepper-line {
    width: 3rem;
  }
}
@media (min-width: 768px) {
  .stepper-line {
    width: 5rem;
  }
}

@media (min-width: 640px) {
  .stepper-line {
    width: 7rem;
  }
}

.stepper-line--active {
  background-color: #060f26;
}
</style>
