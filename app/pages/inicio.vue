<script setup lang="ts">
import { useAuthStore } from '~/store/auth.store'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import CurrencyCalculator from '~/features/3_Dashboard/components/CurrencyCalculator.vue'
import DashboardSidebar from '~/features/3_Dashboard/components/DashboardSidebar.vue'
import DashboardBottomNav from '~/features/3_Dashboard/components/DashboardBottomNav.vue'


definePageMeta({
  middleware: (to, from) => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      return navigateTo('/login')
    }
  }
})

const authStore = useAuthStore()
const { userFirstName } = storeToRefs(authStore)
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex flex-col lg:flex-row bg-[#f5f6f8] font-sans relative">
    
    <DashboardSidebar class="shrink-0" />

    <div class="flex-1 flex flex-col min-w-0 pb-24 lg:pb-0">
      
      <header class="h-[65px] bg-white lg:shadow-sm flex items-center justify-between px-4 lg:px-10 shrink-0 relative z-10">
        
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold text-gray-800 hidden lg:block">Inicio</h1>
        </div>
        
        <div class="hidden xl:block text-xs text-gray-500 text-left leading-relaxed">
          Horario: Lunes a viernes 9:00 am a 7:00 pm <br> Sábados de 09:00 am a 2:00 pm
        </div>

        <div class="flex items-center gap-6">
          <div class="text-sm font-medium text-gray-600 hidden md:block">
            Tienes <span class="font-bold text-gray-800">2500</span> Koinks 🪙
          </div>
          
          <div class="flex items-center gap-2 lg:gap-3 lg:border-l lg:border-gray-200 lg:pl-6 pl-2 pr-2 cursor-pointer hover:opacity-80 transition-opacity" @click="handleLogout" title="Cerrar sesión">
            <div class="w-8 h-8 rounded-full border-2 border-kambista-cyan overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
               <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>
            </div>
            <span class="text-xs lg:text-sm font-semibold text-gray-700 flex items-center gap-1 uppercase">
              {{ userFirstName || 'Usuario' }}
              <svg class="w-4 h-4 text-gray-400 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </span>
          </div>
        </div>
      </header>

      <main class="flex-1 flex flex-col items-center justify-start lg:justify-center relative p-4 pt-6 lg:p-10">
        <img 
          src="https://app.kambista.com/_nuxt/img/logo.b18e48c.png" 
          alt="Kambista" 
          class="h-[70px] object-contain lg:hidden mb-6" 
        />
        <CurrencyCalculator />
      </main>

    </div>

    <DashboardBottomNav />

  </div>
</template>