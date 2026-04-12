<script setup lang="ts">
import { ref, computed } from 'vue'
import banksMock from '~/mocks/bankAccounts.json'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'addAccount'])

const form = ref({
  tipoCuenta: '',
  bancoId: '',
  numeroCuenta: '',
  alias: '',
  esPropia: false
})

const isBankDropdownOpen = ref(false)

const selectedBankObj = computed(() => {
  return banksMock.find(b => b.id === form.value.bancoId)
})

const selectBank = (id: string) => {
  form.value.bancoId = id
  isBankDropdownOpen.value = false
}

const submitAccount = () => {
  if (form.value.esPropia && form.value.numeroCuenta) {
    emit('addAccount', form.value)
    emit('close')
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/40 z-[60] transition-opacity" @click="emit('close')"></div>

  <div 
    class="fixed inset-y-0 right-0 z-[70] w-full max-w-[700px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col"
    :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="flex items-center justify-between p-6 border-b border-gray-100">
      <h2 class="text-lg font-bold text-[#060f26]">Agregar cuenta - SOLES</h2>
      <button @click="emit('close')" class="text-gray-400 hover:text-gray-700 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>

    <div class="p-6 flex-1 overflow-y-auto">
      <p class="text-sm text-gray-700 mb-6">
        La cuenta que registres <span class="font-bold text-[#060f26]">debe estar a tu nombre</span> (titular de este perfil en Kambista)
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pb-8">
        
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <label class="text-xs text-gray-500">Tipo de cuenta</label>
            <select v-model="form.tipoCuenta" class="w-full border border-gray-200 rounded-md p-2.5 text-sm outline-none focus:border-kambista-cyan bg-white">
              <option value="" disabled>Selecciona</option>
              <option value="ahorro">Ahorro</option>
              <option value="corriente">Corriente</option>
            </select>
          </div>

          <div class="flex flex-col gap-1.5 relative">
            <label class="text-xs text-gray-500">Banco</label>
            
            <div 
              @click="isBankDropdownOpen = !isBankDropdownOpen"
              class="w-full border border-gray-200 rounded-md p-2.5 text-sm outline-none bg-white cursor-pointer flex justify-between items-center transition-colors"
              :class="isBankDropdownOpen ? 'border-kambista-cyan ring-1 ring-kambista-cyan/20' : 'hover:border-kambista-cyan'"
            >
              <div class="flex items-center gap-2">
                <img 
                  v-if="selectedBankObj" 
                  :src="`https://cdn.kambista.com/app/images/banks/${selectedBankObj.alias.toLowerCase()}.png`" 
                  class="w-5 h-5 object-contain rounded-sm" 
                />
                <span :class="selectedBankObj ? 'text-gray-800' : 'text-gray-400'">
                  {{ selectedBankObj ? selectedBankObj.alias : 'Selecciona' }}
                </span>
              </div>
              <svg 
                class="w-4 h-4 text-gray-500 transition-transform duration-200" 
                :class="isBankDropdownOpen ? 'rotate-180' : ''"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div 
              v-if="isBankDropdownOpen" 
              class="fixed inset-0 z-40" 
              @click="isBankDropdownOpen = false"
            ></div>

            <div 
              v-if="isBankDropdownOpen" 
              class="absolute top-[100%] left-0 w-full mt-1 bg-white border border-gray-100 rounded-md shadow-lg z-50 max-h-52 overflow-y-auto"
            >
              <div 
                v-for="bank in banksMock" 
                :key="bank.id"
                @click="selectBank(bank.id)"
                class="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <img 
                  :src="`https://cdn.kambista.com/app/images/banks/${bank.alias.toLowerCase()}.png`" 
                  class="w-6 h-6 object-contain rounded-sm shadow-sm border border-gray-50" 
                />
                <span class="text-sm text-gray-700 font-medium">{{ bank.alias }}</span>
              </div>
            </div>
          </div>

          <div class="bg-[#eaf4ff] rounded-md p-4 flex gap-3 items-start border border-[#d6eaff]">
            <svg class="w-5 h-5 text-[#2f80ed] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p class="text-xs text-[#103a71] font-medium leading-relaxed">
              Operamos en Lima con todos los bancos. Y en provincia con el BCP o Interbank.
            </p>
          </div>

          <div class="mt-auto flex flex-col gap-1.5 pt-6">
            <label class="text-xs text-gray-500">Moneda</label>
            <button disabled class="w-full bg-[#878e99] text-white font-bold py-3 rounded-md cursor-not-allowed text-sm">
              SOLES
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <label class="text-xs text-gray-500">Número de cuenta</label>
            <input v-model="form.numeroCuenta" type="text" placeholder="Escribe tu cuenta destino" class="w-full border border-gray-200 rounded-md p-2.5 text-sm outline-none focus:border-kambista-cyan placeholder:text-gray-300" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs text-gray-500">Ponle nombre a tu cuenta</label>
            <input v-model="form.alias" type="text" placeholder="Escribe un alias" class="w-full border border-gray-200 rounded-md p-2.5 text-sm outline-none focus:border-kambista-cyan placeholder:text-gray-300" />
          </div>

          <div class="flex items-start gap-3 mt-2">
            <input v-model="form.esPropia" type="checkbox" id="declaracion" class="mt-1 w-4 h-4 text-kambista-cyan rounded border-gray-300 focus:ring-kambista-cyan" />
            <label for="declaracion" class="text-xs text-gray-600 cursor-pointer">
              <span class="font-bold text-[#060f26]">Declaro que esta cuenta es mía y NO de un tercero</span><br>
              <span class="text-gray-400">*Es obligatorio que la cuenta esté a tu nombre para que el cambio sea exitoso</span>
            </label>
          </div>

          <div class="mt-auto pt-6 flex flex-col justify-end">
            <label class="text-xs text-transparent select-none hidden md:block">Espacio</label> 
            <button 
              @click="submitAccount"
              :disabled="!form.esPropia || !form.numeroCuenta"
              class="w-full bg-[#00e3c2] hover:bg-[#00c9ab] disabled:opacity-50 disabled:cursor-not-allowed text-[#060f26] font-bold py-3 rounded-md transition-colors text-sm uppercase"
            >
              Agregar y Usar
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>