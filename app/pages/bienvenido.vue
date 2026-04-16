<script setup lang="ts">
import { useOperationStore } from '~/stores/operation'

definePageMeta({ layout: false })

useHead({ title: '¡Bienvenido! | Kambista' })

const route = useRoute()
const operationStore = useOperationStore()

const name = computed(() => (route.query.name as string) || '')

function handleContinue() {
  operationStore.completeOnboarding()
  navigateTo('/dashboard')
}
</script>

<template>
  <div class="min-h-screen bg-[#F0F2F5] flex flex-col">

    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        <KLogo variant="dark" size="sm" />
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="flex flex-col items-center text-center max-w-sm w-full">

        <!-- Illustration -->
        <img
          src="/images/dashboard/celphone.png"
          alt="Kambista app"
          class="w-52 h-52 object-contain mb-8"
        />

        <!-- Title -->
        <h1 class="text-2xl sm:text-3xl font-bold text-[#111760] mb-3 leading-tight">
          ¡Felicitaciones<span v-if="name">, {{ name }}</span>!<br />Tu perfil ha sido creado
        </h1>

        <!-- Subtitle -->
        <p class="text-sm text-gray-500 mb-10 leading-relaxed">
          Ya puedes empezar a <em class="not-italic font-semibold text-[#111760]">Kambiar</em>
          con la mejor tasa del mercado
        </p>

        <!-- CTA -->
        <button
          type="button"
          class="w-full max-w-xs py-4 bg-[#00D4C8] text-white rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-[#00BFB4] active:scale-[0.98] transition-all duration-200"
          @click="handleContinue"
        >
          CONTINUAR
        </button>

      </div>
    </main>

  </div>
</template>
