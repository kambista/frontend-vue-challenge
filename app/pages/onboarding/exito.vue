<script setup lang="ts">
import SuccessMessage from '~/features/2_Onboarding/components/SuccessMessage.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/store/auth.store'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const { userPersonalData } = storeToRefs(authStore)

const handleLogout = () => {
  console.log('Cerrando sesión...')
  authStore.logout()
  router.push('/login')
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
        @click="handleLogout" 
        class="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Cerrar Sesión
      </button>
      
    </header>

    <main class="flex-1 flex items-center justify-center p-6 relative z-10">
      <SuccessMessage :userName="userPersonalData?.fullName" />
    </main>
    
  </div>
</template>