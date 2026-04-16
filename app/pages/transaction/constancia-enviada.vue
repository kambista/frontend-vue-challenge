<script setup lang="ts">
import { TRANSACTION_SUCCESS_ILLUSTRATION_SRC } from '~/constants/kambistaDeposit'

useHead({
  title: 'Constancia enviada - Kambista',
})

definePageMeta({
  middleware: 'auth',
})

const tx = useTransactionStore()

if (!tx.completionSnapshot) {
  await navigateTo('/home')
}

const snap = computed(() => tx.completionSnapshot)

async function onVolverInicio() {
  tx.reset()
  await navigateTo('/home')
}
</script>

<template>
  <div v-if="snap" class="min-h-screen bg-[#f4f7f9] text-[#0a1325]">
    <header class="border-b border-[#e6e8ee] bg-white">
      <div class="mx-auto flex h-[72px] max-w-6xl items-center px-4 sm:h-[80px] sm:px-6">
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
      </div>
    </header>

    <main class="mx-auto w-full max-w-[560px] px-4 py-8 sm:px-6 sm:py-10">
      <div
        class="rounded-2xl border border-[#e6e8ee] bg-white px-6 py-8 shadow-[0_4px_28px_rgba(15,23,42,0.07)] sm:px-8 sm:py-10"
      >
        <div class="mb-6 flex justify-center sm:mb-8">
          <img
            :src="TRANSACTION_SUCCESS_ILLUSTRATION_SRC"
            alt=""
            class="h-[140px] w-auto max-w-full object-contain sm:h-[160px]"
            width="220"
            height="180"
          >
        </div>

        <h1 class="mb-8 text-center text-[20px] font-bold leading-snug text-[#0a1325] sm:mb-9 sm:text-[22px]">
          ¡Constancia enviada!
        </h1>

        <dl class="space-y-5 text-[14px]">
          <div>
            <div class="flex justify-between gap-4">
              <dt class="shrink-0 text-[#6b7280]">
                Código Kambista:
              </dt>
              <dd class="text-right font-bold text-[#0a1325]">
                {{ snap.kambistaCode }}
              </dd>
            </div>
            <p class="mt-2 text-[12px] italic leading-snug text-[#9ca3af]">
              *Usa tu código para dar seguimiento a tu operación.
            </p>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="shrink-0 text-[#6b7280]">
              Monto a recibir:
            </dt>
            <dd class="text-right font-bold text-[#0a1325]">
              {{ snap.receiveDisplay }}
            </dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="shrink-0 text-[#6b7280]">
              Tiempo estimado de espera:
            </dt>
            <dd class="text-right font-bold text-[#0a1325]">
              {{ snap.waitLabel }}
            </dd>
          </div>
        </dl>
      </div>

      <div
        class="mt-6 flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#6d28d9] via-[#a855f7] to-[#fdba74] px-4 py-4 shadow-sm sm:mt-7 sm:gap-4 sm:px-5 sm:py-5"
      >
        <span class="hidden shrink-0 sm:block" aria-hidden="true">
          <svg class="h-10 w-10 text-white/90" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="20" cy="22" rx="14" ry="12" fill="currentColor" opacity="0.35" />
            <circle cx="20" cy="18" r="10" fill="currentColor" />
            <circle cx="16" cy="16" r="2" fill="#1e1b4b" />
            <circle cx="24" cy="16" r="2" fill="#1e1b4b" />
          </svg>
        </span>
        <p class="min-w-0 flex-1 text-center text-[12px] font-medium leading-snug text-white drop-shadow-sm sm:text-[13px]">
          Disfruta de
          <span class="mx-0.5 inline-block rounded-md bg-amber-300 px-1.5 py-0.5 font-semibold text-[#1e1b4b] shadow-sm">descuentos</span>
          en los
          <span class="font-bold">mejores comercios</span>
        </p>
        <span class="hidden shrink-0 sm:block" aria-hidden="true">
          <svg class="h-10 w-10 text-white/95" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="12" width="24" height="20" rx="3" fill="#7c3aed" stroke="currentColor" stroke-width="1.5" />
            <path d="M20 8v6M14 11h12" stroke="#fdba74" stroke-width="2" stroke-linecap="round" />
          </svg>
        </span>
      </div>

      <p class="mt-6 text-center text-[13px] leading-relaxed text-[#6b7280] sm:mt-7 sm:text-[14px]">
        Verificaremos tu operación. Puedes ver su estado en 'Mis operaciones'.
      </p>

      <div class="mt-6 sm:mt-7">
        <button
          type="button"
          class="w-full rounded-xl bg-[#42e3b4] py-4 text-center text-[14px] font-semibold uppercase tracking-wide text-[#07122c] transition hover:bg-[#36d4a8] sm:text-[15px]"
          @click="onVolverInicio"
        >
          Volver a inicio
        </button>
      </div>
    </main>
  </div>
</template>
