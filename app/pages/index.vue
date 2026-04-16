<script setup lang="ts">
import CurrencyCalculator from '~/features/3_Dashboard/components/CurrencyCalculator.vue'
</script>

<template>
  <div class="min-h-screen bg-[#051724] bg-[url('https://kambista.com/wp-content/uploads/2026/02/fondo-render-1.png')] bg-cover bg-center bg-no-repeat font-sans flex flex-col relative overflow-hidden">
    
    <header class="w-full flex items-center justify-between px-4 lg:px-12 py-4 lg:py-5 relative z-20">
      
      <div class="flex items-center">
        <img 
          src="https://neocdn.kambista.com/wp-content/uploads/2024/12/logo.svg" 
          alt="Kambista" 
          class="h-6 lg:h-8 object-contain" 
        />
      </div>
      
      <div class="flex items-center gap-3 lg:gap-8 text-sm font-medium text-white/90">
        
        <div class="hidden lg:flex items-center gap-6">
          <a href="#" class="hover:text-white transition-colors flex items-center gap-1">
            Beneficios 
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </a>
          <a href="#" class="hover:text-white transition-colors">Blog</a>
          <a href="#" class="hover:text-white transition-colors">Ayuda</a>
        </div>
        
        <div class="flex items-center gap-2 lg:gap-4 lg:border-l border-white/20 lg:pl-8">
          <NuxtLink to="/login" class="flex items-center gap-1.5 hover:text-white transition-colors text-xs lg:text-sm">
            <svg class="w-4 h-4 lg:w-5 lg:h-5 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span class="hidden sm:inline">Iniciar sesión</span>
            <span class="sm:hidden">Ingresar</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/onboarding" 
            class="border border-white px-3 lg:px-6 py-1.5 lg:py-2 rounded-full hover:bg-white hover:text-[#051724] transition-colors font-semibold text-xs lg:text-sm shrink-0"
          >
            Regístrate
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="flex-1 flex flex-col justify-start lg:justify-center relative z-10 px-6 lg:px-12 pt-2 pb-10 lg:pt-8">
      
      <div class="max-w-[1200px] w-full mx-auto mb-6 lg:mb-10">
        <div class="flex items-center gap-4">
          <button class="bg-[#384c5e] text-white px-6 py-1.5 rounded-full text-sm font-semibold transition-colors">
            Personas
          </button>
          <button class="text-white/70 hover:text-white px-4 py-1.5 text-sm font-semibold transition-colors">
            Empresas
          </button>
        </div>
      </div>

      <div class="max-w-[1200px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        <div class="flex flex-col items-center lg:items-start text-center lg:text-left relative">
          
          <h1 class="text-[36px] lg:text-[48px] font-extrabold text-white leading-[1.1] mb-2 lg:mb-0 tracking-tight relative z-20">
            Cambia <span class="text-[#00e3c2]">dólares</span> <br />
            y soles online <br />
            con <span class="text-[#00e3c2]">Kambista</span>
          </h1>
          
          <div class="relative w-[280px] lg:w-[420px] xl:w-[480px] hidden lg:block lg:-mt-48 lg:translate-x-24 xl:translate-x-32 z-10 pointer-events-none">
            <img 
              src="https://neocdn.kambista.com/wp-content/uploads/2026/02/Banner-Home-MIPRIMERKAMBIO-1-scaled.png" 
              alt="Chanchito Kambista" 
              class="w-full h-auto object-contain drop-shadow-2xl" 
            />
          </div>

        </div>

        <div class="flex justify-center lg:justify-end items-start w-full relative z-20 lg:-mt-10">
          <div class="w-full max-w-[480px]">
            <CurrencyCalculator />
          </div>
        </div>

      </div>
    </main>

  </div>
</template>