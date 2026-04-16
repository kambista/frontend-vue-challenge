<template>
  <header class="bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 py-3 sticky top-0 z-50">
    <NuxtLink to="/dashboard" class="flex-shrink-0 hidden sm:block" aria-label="Ir a inicio">
      <img src="/images/logo-kambista-sinfondo-variante.png" alt="Kambista" class="h-10 md:h-12 block scale-125 md:scale-150 transform-gpu" />
    </NuxtLink>
    
    <div class="flex-1 flex justify-center w-full sm:w-auto">
      <LayoutAppStepper :currentStep="store.currentStep" />
    </div>

    <button
      class="flex-shrink-0 bg-transparent border-none cursor-pointer text-xs md:text-sm font-semibold text-[#111760] flex items-center gap-1 hover:opacity-70 transition-opacity absolute sm:relative right-4 sm:right-0"
      type="button"
      @click="goBack"
    >
      <span class="sm:hidden">Volver</span>
      <span class="hidden sm:inline">‹ Volver</span>
    </button>
  </header>
</template>

<script setup lang="ts">
const store = useOperationStore()
const { goBack } = useOperationFlow()
</script>
