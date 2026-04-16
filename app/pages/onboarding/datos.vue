<script setup lang="ts">
import PersonalDataForm from '~/features/2_Onboarding/components/PersonalDataForm.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-[#f5f6f8] font-sans flex flex-col">
    
    <header class="w-full bg-white h-20 px-6 lg:px-12 flex items-center justify-between shadow-sm shrink-0 relative z-20">
      
      <NuxtLink to="/" class="cursor-pointer">
        <img 
          src="https://app.kambista.com/_nuxt/img/logo.b18e48c.png" 
          alt="Logo Kambista" 
          class="h-8 lg:h-10 w-auto object-contain"
        />
      </NuxtLink>

      <button 
        @click="goBack" 
        class="flex items-center gap-1.5 text-gray-800 font-semibold hover:text-kambista-cyan transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </button>
      
    </header>

    <main class="flex-1 flex items-start lg:items-center justify-center p-6 pt-10 lg:p-12 relative z-10">
      <PersonalDataForm />
    </main>
    
  </div>
</template>