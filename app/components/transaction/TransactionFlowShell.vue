<script setup lang="ts">
defineProps<{
  currentStep: 1 | 2 | 3
}>()

const route = useRoute()
const tx = useTransactionStore()

async function onVolver() {
  const path = route.path.replace(/\/$/, '') || '/'

  if (path === '/transaction/transfiere') {
    tx.setStep(1)
    await navigateTo('/transaction')
    return
  }

  if (path === '/transaction/constancia') {
    tx.setStep(2)
    await navigateTo('/transaction/transfiere')
    return
  }

  await navigateTo('/home')
}
</script>

<template>
  <div class="min-h-screen bg-[#f5f7f9] text-[#0a1325]">
    <header class="border-b border-[#e6e8ee] bg-white">
      <div class="mx-auto flex h-[72px] max-w-6xl items-center gap-3 px-4 sm:h-[80px] sm:px-6">
        <div class="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3" aria-label="Kambista">
          <img
            src="/images/logo_kambista.png"
            alt=""
            width="40"
            height="40"
            class="h-8 w-auto shrink-0 object-contain sm:h-9"
            role="presentation"
          >
          <span class="select-none text-[1.1rem] font-bold leading-none tracking-tight text-[#09162f] sm:text-[1.25rem]">
            Kamb<span class="relative inline-block">i<span class="pointer-events-none absolute -top-1 left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-[2px] bg-teal-500" aria-hidden="true" /></span>sta
          </span>
        </div>

        <TransactionStepper :current-step="currentStep" />

        <button
          type="button"
          class="ml-auto shrink-0 text-[12px] font-semibold uppercase tracking-wide text-[#1a253f] underline-offset-2 hover:underline sm:text-[13px]"
          @click="onVolver"
        >
          &lt; Volver
        </button>
      </div>
    </header>

    <main class="mx-auto w-full max-w-[560px] px-4 py-8 sm:px-6 sm:py-10">
      <slot />
    </main>
  </div>
</template>
