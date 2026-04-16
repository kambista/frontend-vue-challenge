<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOperationStore } from '~/store/operation.store'
import { storeToRefs } from 'pinia'
import TransfiereIcon from '~/features/shared/icons/TransfiereIcon.vue'

const props = defineProps({
  bank: Object
})

const emit = defineEmits(['next'])

const operationStore = useOperationStore()
const { sendAmount, sendCurrency } = storeToRefs(operationStore)

const expirationTime = ref('')

onMounted(() => {
  const date = new Date()
  date.setMinutes(date.getMinutes() + 15)
  expirationTime.value = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
})

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    alert(`Copiado: ${text}`) 
  } catch (err) {
    console.error('Error al copiar: ', err)
  }
}
</script>

<template>
  <main class="flex-1 flex flex-col items-center py-6 md:py-10 px-4">
      
    <div class="w-full max-w-[400px]">
      
      <p class="text-[13px] text-gray-500 text-center mb-5">
        El tipo de cambio podría actualizarse a las: 
        <span class="font-bold text-[#060f26] text-base ml-1">{{ expirationTime }}</span>
      </p>

      <div class="bg-white rounded-xl shadow-sm p-6 md:p-8 text-center w-full border border-gray-100">
        
        <div class="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <TransfiereIcon />
        </div>

        <p class="text-[15px] text-gray-600 leading-relaxed mb-6 px-2">
          Transfiere desde tu app bancaria y guarda el <span class="font-bold text-[#060f26] border-b border-gray-800 pb-0.5">número o código de operación</span> para el siguiente paso.
        </p>

        <div class="border border-gray-200 rounded-xl p-5 text-left space-y-4 bg-white">
          
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 font-medium mb-0.5">Banco</span>
            <span class="text-[15px] font-bold text-[#060f26]">{{ bank ? bank.name : 'Banco Interbank' }}</span>
          </div>

          <div class="flex justify-between items-center group">
            <div class="flex flex-col">
              <span class="text-xs text-gray-500 font-medium mb-0.5">Monto</span>
              <span class="text-[15px] font-bold text-[#060f26]">{{ sendCurrency === 'Dólares' ? '$' : 'S/' }} {{ sendAmount }}</span>
            </div>
            <button @click="copyToClipboard(sendAmount)" class="p-2 text-gray-400 hover:text-kambista-cyan transition-colors" title="Copiar Monto">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </button>
          </div>

          <div class="flex justify-between items-center group">
            <div class="flex flex-col">
              <span class="text-xs text-gray-500 font-medium mb-0.5">Número de cuenta</span>
              <span class="text-[15px] font-bold text-[#060f26]">201010000000000</span>
            </div>
            <button @click="copyToClipboard('201010000000000')" class="p-2 text-gray-400 hover:text-kambista-cyan transition-colors" title="Copiar Cuenta">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </button>
          </div>

          <div class="flex justify-between items-center group">
            <div class="flex flex-col">
              <span class="text-xs text-gray-500 font-medium mb-0.5">RUC</span>
              <span class="text-[15px] font-bold text-[#060f26]">20601708141</span>
            </div>
            <button @click="copyToClipboard('20601708141')" class="p-2 text-gray-400 hover:text-kambista-cyan transition-colors" title="Copiar RUC">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </button>
          </div>

          <div class="flex flex-col">
            <span class="text-xs text-gray-500 font-medium mb-0.5">Titular de la cuenta</span>
            <span class="text-[15px] font-bold text-[#060f26]">Kambista SAC</span>
          </div>

          <div class="flex flex-col pb-1">
            <span class="text-xs text-gray-500 font-medium mb-0.5">Tipo de cuenta</span>
            <span class="text-[15px] font-bold text-[#060f26]">Corriente</span>
          </div>
        </div>
      </div>

      <div class="pt-6 pb-10">
        <button 
          @click="emit('next')"
          class="w-full bg-[#00e3c2] hover:bg-[#00c9ab] text-[#060f26] font-bold py-3.5 rounded-lg shadow-sm transition-colors uppercase"
        >
          Ya hice mi transferencia
        </button>
      </div>

    </div>
  </main>
</template>