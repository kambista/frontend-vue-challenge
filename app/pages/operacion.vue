<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Step1Completa from '~/features/4_Operation/components/Step1Completa.vue'
import Step2Transfiere from '~/features/4_Operation/components/Step2Transfiere.vue'

const router = useRouter()

const currentStep = ref(1)

const operationDetails = ref<any>({
  bank: null,
  account: null,
  fund: ''
})

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
    window.scrollTo(0, 0)
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  } else {
    router.back()
  }
}

const handleStep1Continue = (data: any) => {
  operationDetails.value = data
  nextStep()
}
</script>

<template>
  <div class="min-h-screen bg-[#f5f6f8] font-sans flex flex-col">
    
    <header class="bg-white shadow-sm sticky top-0 z-20">
      <div class="max-w-6xl mx-auto px-4 h-[60px] md:h-[70px] flex items-center justify-between">
        
        <div class="flex md:hidden items-center w-full relative">
          <button @click="prevStep" class="absolute left-0 p-2 text-[#060f26]">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div class="w-full text-center font-bold text-[#060f26] text-[17px]">
            {{ currentStep === 1 ? 'Completa tu operación' : 'Transfiere a Kambista' }}
          </div>
        </div>

        <div class="w-32 shrink-0 hidden md:block">
          <img src="https://app.kambista.com/_nuxt/img/logo.b18e48c.png" alt="Kambista" class="object-contain h-8" />
        </div>
        
        <div class="hidden md:flex flex-1 max-w-lg mx-auto items-center relative px-5 py-3">
          <div class="absolute top-1/2 left-12 right-12 h-0.5 bg-gray-200 -z-10 -translate-y-1/2">
            <div class="h-full bg-[#060f26] transition-all duration-300" :style="{ width: currentStep > 1 ? '50%' : '0%' }"></div>
          </div>
          
          <div class="flex flex-col items-center flex-1">
            <div class="w-5 h-5 rounded-full border-4 shadow-sm relative z-10 transition-colors" :class="currentStep >= 1 ? 'bg-[#060f26] border-white' : 'bg-gray-300 border-white'"></div>
            <span class="text-xs font-bold mt-2 absolute top-6" :class="currentStep >= 1 ? 'text-[#060f26]' : 'text-gray-400'">Completa</span>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="w-5 h-5 rounded-full border-4 shadow-sm relative z-10 transition-colors" :class="currentStep >= 2 ? 'bg-[#060f26] border-white' : 'bg-gray-300 border-white'"></div>
            <span class="text-xs mt-2 absolute top-6" :class="currentStep >= 2 ? 'text-[#060f26] font-bold' : 'text-gray-400 font-medium'">Transfiere</span>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="w-5 h-5 rounded-full border-4 shadow-sm relative z-10 bg-gray-300 border-white"></div>
            <span class="text-xs font-medium text-gray-400 mt-2 absolute top-6 whitespace-nowrap">Constancia</span>
          </div>
        </div>

        <div class="w-32 hidden md:flex justify-end shrink-0">
          <button @click="prevStep" class="flex items-center gap-2 text-[#060f26] font-bold hover:opacity-80 transition-opacity">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            Volver
          </button>
        </div>
      </div>
      
      <div class="md:hidden w-full px-8 pb-3 pt-1 border-b border-gray-100 flex items-center justify-between relative">
         <div class="absolute top-1/2 left-10 right-10 h-[2px] bg-gray-200 -z-10">
            <div class="h-full bg-[#060f26] transition-all duration-300" :style="{ width: currentStep > 1 ? '50%' : '0%' }"></div>
         </div>
         <div class="flex flex-col items-center gap-1 bg-white px-1">
            <div class="w-3 h-3 rounded-full" :class="currentStep >= 1 ? 'bg-[#060f26]' : 'bg-gray-300'"></div>
            <span class="text-[10px] font-bold" :class="currentStep >= 1 ? 'text-[#060f26]' : 'text-gray-400'">Completa</span>
         </div>
         <div class="flex flex-col items-center gap-1 bg-white px-1">
            <div class="w-3 h-3 rounded-full" :class="currentStep >= 2 ? 'bg-[#060f26]' : 'bg-gray-300'"></div>
            <span class="text-[10px] font-bold" :class="currentStep >= 2 ? 'text-[#060f26]' : 'text-gray-400'">Transfiere</span>
         </div>
         <div class="flex flex-col items-center gap-1 bg-white px-1">
            <div class="w-3 h-3 rounded-full bg-gray-300"></div>
            <span class="text-[10px] font-medium text-gray-400">Constancia</span>
         </div>
      </div>
    </header>

    <Step1Completa 
      v-if="currentStep === 1" 
      @continue="handleStep1Continue" 
    />

    <Step2Transfiere 
      v-if="currentStep === 2" 
      :bank="operationDetails.bank"
      @next="nextStep"
    />

  </div>
</template>