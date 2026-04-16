<script setup lang="ts">
useHead({
  title: 'Regístrate — Kambista',
})

const goToLogin = () => navigateTo('/auth/login')
</script>

<template>
  <div class="relative min-h-screen bg-[#f8f9fb]">
    <header class="bg-white">
      <div class="mx-auto flex h-[74px] w-full max-w-[1360px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <img
          src="/images/logo_kambista.png"
          alt="Kambista"
          class="h-10 w-auto sm:h-11"
          width="160"
          height="44"
        >
        <button
          class="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-slate-800"
          @click="goToLogin"
        >
          <svg class="h-4 w-4 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
      </div>
    </header>

    <main class="mx-auto flex min-h-[calc(100vh-74px)] w-full max-w-[1360px] items-center justify-center px-4 pb-24 pt-10 sm:px-8 lg:px-10">
      <RegisterForm />
    </main>

    <FloatingWhatsAppButton />
  </div>
</template>
