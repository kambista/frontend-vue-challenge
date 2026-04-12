<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOperationStore } from '~/store/operation.store'
import { storeToRefs } from 'pinia'

import AddAccountSlideOver from '~/features/4_Operation/components/AddAccountSlideOver.vue'
import OriginBankModal from '~/features/4_Operation/components/OriginBankModal.vue'
import SourceFundsModal from '~/features/4_Operation/components/SourceFundsModal.vue'

const router = useRouter()

const operationStore = useOperationStore()
const { sendAmount, sendCurrency, receiveAmount, receiveCurrency, rateCompra, rateVenta } = storeToRefs(operationStore)

const isOriginModalOpen = ref(false)
const isSelectAccountModalOpen = ref(false)
const isAddAccountOpen = ref(false)
const isSourceFundsModalOpen = ref(false)

const selectedOriginBank = ref<any>(null)
const selectedDestinationAccount = ref('')
const selectedSourceFund = ref('')

const handleSelectOriginBank = (bank: any) => {
  selectedOriginBank.value = bank
}

const handleSelectSourceFund = (fundName: string) => { // <-- NUEVO
  selectedSourceFund.value = fundName
}

const openAddAccountSlideOver = () => {
  isSelectAccountModalOpen.value = false
  isAddAccountOpen.value = true
}

const handleAddAccount = (newAccount: any) => {
  console.log('Nueva cuenta agregada:', newAccount)
  selectedDestinationAccount.value = newAccount.numeroCuenta
}
</script>

<template>
  <div class="min-h-screen bg-[#f5f6f8] font-sans flex flex-col">
    
    <header class="bg-white shadow-sm sticky top-0 z-20">
      <div class="max-w-6xl mx-auto px-4 h-[60px] flex items-center justify-between">
        <div class="w-32 shrink-0">
          <img src="https://app.kambista.com/_nuxt/img/logo.b18e48c.png" alt="Kambista" class="object-contain" />
        </div>
        
        <div class="hidden md:flex flex-1 max-w-lg mx-auto items-center relative px-5 py-3">
          <div class="absolute top-1/2 left-12 right-12 h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>
          <div class="flex flex-col items-center flex-1">
            <div class="w-5 h-5 bg-[#060f26] rounded-full border-4 border-white shadow-sm relative z-10"></div>
            <span class="text-xs font-bold text-[#060f26] mt-2 absolute top-6">Completa</span>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="w-5 h-5 bg-gray-300 rounded-full border-4 border-white shadow-sm relative z-10"></div>
            <span class="text-xs font-medium text-gray-400 mt-2 absolute top-6">Transfiere</span>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="w-5 h-5 bg-gray-300 rounded-full border-4 border-white shadow-sm relative z-10"></div>
            <span class="text-xs font-medium text-gray-400 mt-2 absolute top-6 whitespace-nowrap">Envía constancia</span>
          </div>
        </div>

        <div class="w-32 flex justify-end shrink-0">
          <button @click="router.back()" class="flex items-center gap-2 text-[#060f26] font-bold hover:opacity-80 transition-opacity">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            Volver
          </button>
        </div>
      </div>
    </header>

    <main class="flex-1 flex flex-col items-center py-10 px-4">
      <h1 class="text-2xl font-bold text-[#060f26] mb-8 text-center">Completa los datos de tu operación</h1>

      <div class="w-full max-w-[400px] flex flex-col gap-4">
        
        <div class="bg-white rounded-xl shadow-sm p-6 space-y-3 text-sm">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Tú envías</span>
            <span class="font-bold text-[#060f26]">{{ sendCurrency === 'Dólares' ? '$' : 'S/' }} {{ sendAmount }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Tú recibes</span>
            <span class="font-bold text-[#060f26]">{{ receiveCurrency === 'Soles' ? 'S/' : '$' }} {{ receiveAmount }}</span>
          </div>
          <div class="flex justify-between items-center border-b border-gray-100 pb-3">
            <span class="text-gray-600">Cupón aplicado</span>
            <span class="font-bold text-gray-400">-</span>
          </div>
          <div class="pt-1 flex justify-between items-center">
            <span class="text-[#060f26] font-bold">Tipo de cambio utilizado</span>
            <span class="font-bold text-sm text-[#060f26]">
              {{ sendCurrency === 'Dólares' ? rateCompra : rateVenta }}
            </span>
          </div>
        </div>

        <div class="bg-[#eaf4ff] rounded-xl p-4 flex gap-3 items-start relative">
          <svg class="w-5 h-5 text-[#2f80ed] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p class="text-xs text-[#103a71] leading-relaxed pr-4">
            Tiempo estimado de espera <span class="font-bold">BCP, Interbank, BanBif y Pichincha: 15 minutos</span> (Aplica para cualquier monto). Otros bancos 1 día útil.
          </p>
        </div>

        <div class="flex flex-col gap-5 mt-2">
          
          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] text-gray-500">¿Desde qué banco nos envías tu dinero?</label>
            <button 
              @click="isOriginModalOpen = true"
              class="w-full border border-gray-200 rounded-lg p-3 text-sm bg-white flex justify-between items-center hover:border-kambista-cyan transition-colors"
            >
              <div class="flex items-center gap-3">
                <img 
                  v-if="selectedOriginBank" 
                  :src="`https://cdn.kambista.com/app/images/banks/${selectedOriginBank.alias.toLowerCase()}.png`" 
                  class="w-6 h-6 object-contain rounded-sm"
                />
                <span :class="selectedOriginBank ? 'text-gray-800' : 'text-gray-400'">
                  {{ selectedOriginBank ? selectedOriginBank.name : 'Selecciona' }}
                </span>
              </div>
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>

          <div class="flex flex-col gap-1.5 relative">
            <label class="text-[13px] text-gray-500">¿En qué cuenta deseas recibir tu dinero?</label>
            <button 
              @click="isSelectAccountModalOpen = true" 
              class="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none bg-white flex justify-between items-center hover:border-kambista-cyan transition-colors"
            >
              <span :class="selectedDestinationAccount ? 'text-gray-800' : 'text-gray-400'">
                {{ selectedDestinationAccount || 'Selecciona o Agrega Cuenta' }}
              </span>
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </button>

            <div class="bg-[#fff7ea] rounded-xl p-3 flex gap-2 items-start mt-1 relative">
               <svg class="w-5 h-5 text-[#f2994a] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               <p class="text-[11px] text-[#b46b1a] leading-tight pr-4">
                 Recuerda que las cuentas deben <span class="font-bold">estar a tu nombre.</span> Kambista <span class="font-bold">no transfiere a cuentas de terceros.</span>
               </p>
               <button class="absolute top-3 right-3 text-[#b46b1a] hover:opacity-70">
                 <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] text-gray-500">Origen de fondos</label>
            <button 
              @click="isSourceFundsModalOpen = true"
              class="w-full border border-gray-200 rounded-lg p-3 text-sm bg-white flex justify-between items-center hover:border-kambista-cyan transition-colors"
            >
              <span :class="selectedSourceFund ? 'text-gray-800' : 'text-gray-400'">
                {{ selectedSourceFund || 'Selecciona' }}
              </span>
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>

        </div>

        <div class="pt-4">
          <button 
            class="w-full bg-[#00e3c2] hover:bg-[#00c9ab] text-[#060f26] font-bold py-3.5 rounded-lg shadow-sm transition-colors uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!selectedOriginBank || !selectedDestinationAccount || !selectedSourceFund"
          >
            Continuar
          </button>
        </div>

      </div>
    </main>

    <OriginBankModal 
      :isOpen="isOriginModalOpen" 
      @close="isOriginModalOpen = false"
      @select="handleSelectOriginBank"
    />

    <SourceFundsModal
      :isOpen="isSourceFundsModalOpen"
      @close="isSourceFundsModalOpen = false"
      @select="handleSelectSourceFund"
    />

    <div v-if="isSelectAccountModalOpen" class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div class="bg-[#060f26] p-6 text-white relative">
          <button @click="isSelectAccountModalOpen = false" class="absolute top-4 right-4 text-gray-300 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <h2 class="text-2xl font-bold">Cuentas <span class="font-normal">{{ receiveCurrency }}</span></h2>
          <p class="text-sm mt-1 text-gray-200">Selecciona tu cuenta de destino</p>
        </div>
        <div class="p-6 pb-10">
          <button @click="openAddAccountSlideOver" class="flex items-center gap-4 border border-gray-300 rounded-xl p-4 w-full hover:border-kambista-cyan hover:bg-[#f0fcfb] transition-colors group">
            <div class="w-10 h-10 rounded-md border-2 border-[#060f26] flex items-center justify-center group-hover:border-kambista-cyan transition-colors">
              <svg class="w-6 h-6 text-[#060f26] group-hover:text-kambista-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            </div>
            <span class="text-[#060f26] font-medium">Agregar cuenta</span>
          </button>
        </div>
      </div>
    </div>

    <AddAccountSlideOver 
      :isOpen="isAddAccountOpen" 
      @close="isAddAccountOpen = false" 
      @addAccount="handleAddAccount"
    />

  </div>
</template>