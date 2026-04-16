<script setup lang="ts">
import banksMock from '~/mocks/bankAccounts.json'

defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'select'])

const selectBank = (bank: any) => {
  emit('select', bank)
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex justify-center items-end md:items-center">
    
    <div class="absolute inset-0 bg-black/40 transition-opacity" @click="emit('close')"></div>

    <div 
      class="bg-white w-full max-w-md md:rounded-xl rounded-t-2xl z-10 transform transition-transform flex flex-col max-h-[85vh] md:max-h-[70vh] shadow-2xl"
    >
      <div class="p-6 pb-4 flex justify-between items-center relative">
        <h3 class="text-[17px] font-medium text-[#060f26] w-full">¿Desde qué banco nos envías tu dinero?</h3>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-700 hidden md:block">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      <div class="w-[90%] mx-auto h-px bg-gray-100"></div>

      <div class="p-4 overflow-y-auto">
        <div 
          v-for="bank in banksMock" 
          :key="bank.id"
          @click="selectBank(bank)"
          class="flex items-center gap-4 py-3 px-3 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors group"
        >
          <img 
            :src="`https://cdn.kambista.com/app/images/banks/${bank.alias.toLowerCase()}.png`" 
            :alt="bank.alias" 
            class="w-10 h-10 rounded object-contain border border-gray-100 shadow-sm"
          >
          <div class="flex flex-col justify-center w-full">
            <p class="text-base font-medium text-[#060f26] group-hover:text-kambista-cyan transition-colors">
              {{ bank.name }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>