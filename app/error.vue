<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#111760] to-[#0A0E4A] px-4">
    <div class="max-w-md text-center">
      <!-- Error Code -->
      <div class="mb-6">
        <h1 class="text-9xl font-black text-white opacity-20 mb-2">404</h1>
        <h2 class="text-3xl font-bold text-white mb-2">Página no encontrada</h2>
        <p class="text-gray-300 text-base leading-relaxed">
          La página que buscas no existe o ha sido movida. No te preocupes, aquí estamos para ayudarte.
        </p>
      </div>

      <!-- Illustration placeholder -->
      <div class="mb-8 flex justify-center">
        <div class="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center">
          <svg
            class="w-20 h-20 text-[#00D4C8]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      <!-- Action button -->
      <NuxtLink
        to="/dashboard"
        class="inline-block px-8 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-200 bg-[#00D4C8] text-white hover:bg-[#00BFB4] active:scale-[0.98] shadow-lg hover:shadow-xl"
      >
        Ir al Dashboard
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})
</script>
