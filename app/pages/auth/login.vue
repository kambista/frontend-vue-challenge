<script setup lang="ts">
useHead({
  title: 'Inicia sesión — Kambista',
})

definePageMeta({
  middleware: 'guest',
})
</script>

<template>
  <AppModal variant="split">
    <template #aside>
      <div
        class="flex min-h-[320px] flex-1 flex-col bg-[#0a1628] px-8 py-10 text-white lg:min-h-screen lg:px-12 lg:py-14 justify-center">
        <div class="mb-10 flex items-center justify-center gap-4">
          <img src="/images/logo_kambista.png" alt="Logo Kambista" class="h-[74px] w-auto">
          <span class="text-5xl font-extrabold tracking-tight text-white">
            Kambista
          </span>
        </div>

        <ul class="flex flex-col gap-10">
          <li class="flex gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10"
              aria-hidden="true">
              <svg class="h-7 w-7 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M15.75 15.75V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-7.5A2.25 2.25 0 016 8.25h2.25M9 12h6m-6 0a3 3 0 103 3m-3-3h3" />
              </svg>
            </div>
            <div>
              <p class="font-semibold text-white">
                Cotiza tu operación
              </p>
              <p class="mt-1 text-sm leading-relaxed text-slate-300">
                Utiliza la calculadora para verificar el
                <span class="font-medium text-cyan-300">Tipo de Cambio</span>
                en tiempo real.
              </p>
            </div>
          </li>

          <li class="flex gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10"
              aria-hidden="true">
              <svg class="h-7 w-7 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </div>
            <div>
              <p class="font-semibold text-white">
                Realiza la transferencia
              </p>
              <p class="mt-1 text-sm leading-relaxed text-slate-300">
                Envía desde tu banco el
                <span class="font-medium text-cyan-300">dinero</span>
                que desees cambiar a la
                <span class="font-medium text-cyan-300">cuenta</span>
                de Kambista indicada.
              </p>
            </div>
          </li>

          <li class="flex gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10"
              aria-hidden="true">
              <svg class="h-7 w-7 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
            </div>
            <div>
              <p class="font-semibold text-white">
                Obtén tu dinero
              </p>
              <p class="mt-1 text-sm leading-relaxed text-slate-300">
                El dinero será
                <span class="font-medium text-cyan-300">depositado</span>
                en tu cuenta de destino.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </template>

    <LoginForm />
  </AppModal>
</template>
