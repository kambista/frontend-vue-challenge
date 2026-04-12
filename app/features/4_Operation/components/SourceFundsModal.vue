<script setup lang="ts">
import sourceFundsMock from '~/mocks/sourceFunds.json'

defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'select'])

const selectFund = (fundName: string) => {
  emit('select', fundName)
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex justify-center items-end md:items-center">
    
    <div class="absolute inset-0 bg-black/40 transition-opacity" @click="emit('close')"></div>

    <div class="bg-white w-full max-w-md md:rounded-xl rounded-t-2xl z-10 transform transition-transform flex flex-col max-h-[85vh] md:max-h-[70vh] shadow-2xl">
      
      <div class="p-6 pb-4 flex justify-between items-center relative">
        <h3 class="text-[17px] font-medium text-[#060f26] w-full">Origen de fondos</h3>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-700 hidden md:block">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      <div class="w-[90%] mx-auto h-px bg-gray-100"></div>

      <div class="p-4 overflow-y-auto">
        <div 
          v-for="fund in sourceFundsMock" 
          :key="fund._id"
          @click="selectFund(fund.name)"
          class="flex items-center py-4 px-4 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors group"
        >
          <p class="text-base font-medium text-[#060f26] group-hover:text-kambista-cyan transition-colors">
            {{ fund.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>