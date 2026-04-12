<script setup lang="ts">
import { useOperationStore } from '~/store/operation.store'
import { storeToRefs } from 'pinia'
import Step4ExitoIcon from '~/features/shared/icons/Step4ExitoIcon.vue'
import Step4Banner from '~/features/shared/icons/Step4Banner.vue'

const emit = defineEmits(['goHome'])

const operationStore = useOperationStore()
const { receiveAmount, receiveCurrency } = storeToRefs(operationStore)

const transactionCode = 'km' + Math.random().toString(36).substring(2, 8)
</script>

<template>
  <main class="flex-1 flex flex-col items-center justify-center py-6 md:py-10 px-4">
    <div class="w-full max-w-[400px]">
      
      <div class="bg-white rounded-xl shadow-sm p-6 md:p-8 w-full border border-gray-100 text-center mb-6">
        
        <div class="w-28 h-28 mx-auto mb-2 flex items-center justify-center">
          <Step4ExitoIcon />
          </div>

        <h2 class="text-xl font-bold text-[#060f26] mb-6 pb-4 border-b border-gray-200">
          ¡Constancia enviada!
        </h2>

        <div class="text-left space-y-4">
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 font-medium mb-0.5">Código Kambista</span>
            <span class="text-base font-bold text-[#060f26]">{{ transactionCode }}</span>
            <span class="text-[11px] text-[#060f26] mt-1 leading-tight font-medium">
              *Usa tu código para dar seguimiento a tu operación.
            </span>
          </div>

          <div class="flex flex-col">
            <span class="text-xs text-gray-500 font-medium mb-0.5">Monto a recibir</span>
            <span class="text-base font-bold text-[#060f26]">{{ receiveCurrency === 'Soles' ? 'S/' : '$' }} {{ receiveAmount }}</span>
          </div>

          <div class="flex flex-col">
            <span class="text-xs text-gray-500 font-medium mb-0.5">Tiempo estimado de espera</span>
            <span class="text-base font-bold text-[#060f26]">15 minutos</span> </div>
        </div>
      </div>

      <div class="w-full h-[88px] bg-gradient-to-r from-[#ffd3b6] to-[#ffaaa5] rounded-xl mb-6 flex items-center justify-center shadow-sm overflow-hidden relative cursor-pointer hover:opacity-95 transition-opacity">
        <Step4Banner />
        </div>

      <p class="text-[13px] text-gray-600 text-center leading-relaxed px-4 mb-8">
        Verificaremos tu operación. Puedes ver su estado en "Mis operaciones".
      </p>

      <div class="pb-10">
        <button 
          @click="emit('goHome')"
          class="w-full bg-[#00e3c2] hover:bg-[#00c9ab] text-[#060f26] font-bold py-3.5 rounded-lg shadow-sm transition-colors uppercase"
        >
          Volver a inicio
        </button>
      </div>

    </div>
  </main>
</template>