<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Sticky header with stepper -->
    <div class="sticky top-0 z-40 bg-white shadow-sm">
      <TransferHeader
        :current-step="currentStep"
        @back="handleBack"
      />
    </div>

    <!-- Step content -->
    <main class="flex-1">
      <Transition :name="transitionName" mode="out-in">
        <!-- Step 0: Completa -->
        <TransferStepCompleta
          v-if="currentStep === 0"
          key="completa"
          @continue="goToStep(1)"
        />

        <!-- Step 1: Transfiere -->
        <TransferStepTransfiere
          v-else-if="currentStep === 1"
          key="transfiere"
          @transfer-done="goToStep(2)"
        />

        <!-- Step 2: Envía constancia -->
        <TransferStepConstancia
          v-else-if="currentStep === 2"
          key="constancia"
          @submit="handleConstanciaSubmit"
        />
      </Transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: false,
  middleware: 'operation-guard',
})

const router = useRouter()
const store = useOperationStore()
const currentStep = ref(0)
const transitionName = ref('slide-left')

function goToStep(step: number) {
  transitionName.value = step > currentStep.value ? 'slide-left' : 'slide-right'
  currentStep.value = step
  // Keep store step in sync (1-indexed)
  const storeStep = (step + 1) as 1 | 2 | 3
  if (storeStep <= 3) store.setStep(storeStep)
}

function handleBack() {
  if (currentStep.value === 0) {
    router.push('/dashboard')
  } else {
    goToStep(currentStep.value - 1)
  }
}

function handleConstanciaSubmit() {
  router.replace('/operacion/constancia')
}
</script>

<style scoped>
/* Forward navigation */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.25s ease;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

/* Backward navigation */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.25s ease;
}
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
</style>
