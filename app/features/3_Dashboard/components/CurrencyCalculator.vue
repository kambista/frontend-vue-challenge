<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
const activeTab = ref<'compra' | 'venta'>('compra')
const sendAmount = ref<string>('')
const receiveAmount = ref<string>('')
const isLoading = ref(false)

const rates = ref({ compra: 0, venta: 0 })
const ahorroOficial = ref('0.00')

// --------------------------------------------------------
// REQUERIMIENTO 2.1: Consumo de API para Tipo de Cambio
// --------------------------------------------------------
const fetchCurrentRates = async () => {
  try {
    const response: any = await $fetch('https://api.kambista.com/v1/exchange/kambista/current')
    rates.value.compra = response?.tc?.bid || 3.321
    rates.value.venta = response?.tc?.ask || 3.350
  } catch (error) {
    console.error('Error obteniendo el tipo de cambio:', error)
    rates.value = { compra: 3.321, venta: 3.350 }
  }
}

onMounted(() => {
  fetchCurrentRates()
  sendAmount.value = '1000'
  calculateWithAPI('send', '1000')
})

const sendCurrency = computed(() => activeTab.value === 'compra' ? 'Dólares' : 'Soles')
const receiveCurrency = computed(() => activeTab.value === 'compra' ? 'Soles' : 'Dólares')

// --------------------------------------------------------
// REQUERIMIENTO 2.2 y 2.3: Consumo de API para Cálculo en Tiempo Real
// --------------------------------------------------------
let debounceTimer: ReturnType<typeof setTimeout>

const calculateWithAPI = async (source: 'send' | 'receive', amount: string) => {
  if (!amount || isNaN(Number(amount))) {
    if (source === 'send') receiveAmount.value = ''
    else sendAmount.value = ''
    return
  }

  isLoading.value = true
  
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    try {
      const originCurrency = activeTab.value === 'compra' ? 'USD' : 'PEN'
      const destinationCurrency = activeTab.value === 'compra' ? 'PEN' : 'USD'
      
      const response: any = await $fetch('https://api.kambista.com/v1/exchange/calculates', {
        params: {
          originCurrency,
          destinationCurrency,
          amount: amount,
          active: 'S'
        }
      })

      if (response?.tc) {
        rates.value.compra = response.tc.bid
        rates.value.venta = response.tc.ask
      }

      // Actualizamos los montos
      const calculatedValue = response?.exchange ? response.exchange.toFixed(2) : '0.00'
      
      if (source === 'send') {
        receiveAmount.value = calculatedValue
      } else {
        sendAmount.value = calculatedValue
      }

      // Actualizamos el ahorro
      if (response?.savings?.amount) {
        ahorroOficial.value = response.savings.amount
      }

    } catch (error) {
      console.error('Error calculando la operación:', error)
    } finally {
      isLoading.value = false
    }
  }, 400)
}

const onSendInput = (e: Event) => {
  sendAmount.value = (e.target as HTMLInputElement).value
  calculateWithAPI('send', sendAmount.value)
}

const onReceiveInput = (e: Event) => {
  receiveAmount.value = (e.target as HTMLInputElement).value
  calculateWithAPI('receive', receiveAmount.value)
}

const setTab = (tab: 'compra' | 'venta') => {
  activeTab.value = tab
  calculateWithAPI('send', sendAmount.value)
}
const toggleTab = () => {
  setTab(activeTab.value === 'compra' ? 'venta' : 'compra')
}


const koinksGanados = computed(() => {
  const baseDolares = activeTab.value === 'compra' ? parseFloat(sendAmount.value) : parseFloat(receiveAmount.value)
  return Math.floor(baseDolares || 0).toLocaleString()
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
    
    <div class="flex w-full h-12 cursor-pointer text-sm font-semibold">
      <div @click="setTab('compra')" class="flex-1 flex items-center justify-center transition-colors" :class="activeTab === 'compra' ? 'bg-[#182233] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'">
        Compra: {{ rates.compra }}
      </div>
      <div @click="setTab('venta')" class="flex-1 flex items-center justify-center transition-colors" :class="activeTab === 'venta' ? 'bg-[#182233] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'">
        Venta: {{ rates.venta }}
      </div>
    </div>

    <div class="p-5 lg:p-6 space-y-4">
      
      <div class="relative flex flex-col gap-2">
        <div class="flex rounded-lg overflow-hidden border border-transparent focus-within:border-kambista-cyan transition-colors">
          <div class="bg-[#e9ecef] flex-1 py-2 px-4 flex flex-col justify-center">
            <label class="text-xs text-gray-500 font-medium text-left">¿Cuánto envías?</label>
            <input 
              :value="sendAmount" 
              @input="onSendInput" 
              type="number" 
              class="bg-transparent text-lg font-bold text-gray-800 outline-none w-full" 
            />
          </div>
          <div class="bg-[#182233] text-white w-1/3 flex items-center justify-between px-4 cursor-pointer">
            <span class="font-semibold text-sm">{{ sendCurrency }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        <button @click="toggleTab" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md border border-gray-100 hover:bg-gray-50 z-10 transition-transform hover:scale-105 active:scale-95">
          <svg width="50" height="49.558" viewBox="0 0 50 49.558" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity=".1" filter="url(#a)"><path fill="#192232" d="M38.533 23.451a13.735 13.717 0 0 1-13.736 13.717 13.735 13.717 0 0 1-13.735-13.717 13.735 13.717 0 0 1 27.471 0"/></g><g filter="url(#b)"><path fill="#f3f3f3" d="M33.343 23.451a8.546 8.535 0 0 1-8.546 8.535 8.546 8.535 0 0 1-8.547-8.535 8.546 8.535 0 0 1 17.093 0"/></g><g clip-path="url(#c)" fill="#000" stroke="#000" stroke-width=".5"><path d="M28.767 24.856a.36.36 0 0 0-.442.188l-.019.056c-.308.769-.923 1.407-1.712 1.782a3.87 3.87 0 0 1-2.713.206c-1.135-.338-2.04-1.219-2.348-2.307v-.037l.674.319c.173.075.385.019.462-.15.038-.075.058-.169.019-.243-.019-.094-.096-.15-.173-.188l-1.462-.694c-.115-.056-.231 0-.288.094l-.731 1.332c-.038.093-.058.168-.019.262s.096.15.173.188c.173.075.385.019.462-.15l.25-.469.019.057c.173.506.423.975.789 1.388a4.2 4.2 0 0 0 1.962 1.238 4.3 4.3 0 0 0 1.289.188c.673 0 1.347-.15 1.943-.431.885-.431 1.578-1.106 1.943-1.95a.3.3 0 0 0 .058-.075l.058-.169c.039-.075.019-.169-.019-.263-.019-.075-.096-.131-.173-.169Zm.904-3.131a.34.34 0 0 0-.173-.188.355.355 0 0 0-.462.15l-.269.488-.019-.056a4 4 0 0 0-.789-1.388c-.519-.581-1.193-.994-1.962-1.238a4.48 4.48 0 0 0-3.233.243c-.904.432-1.616 1.144-1.982 1.988l-.096.225c-.038.075-.019.169.019.244s.115.15.192.169c.173.056.385-.038.442-.206l.019-.057c.308-.788.923-1.425 1.712-1.8a3.87 3.87 0 0 1 2.713-.206c1.155.338 2.04 1.238 2.348 2.326v.038l-.712-.338c-.173-.075-.385-.019-.462.15a.28.28 0 0 0 .019.319c.038.057.077.113.154.131l1.482.694.058.019h.038c.135 0 .192-.094.192-.113l.731-1.369c.058-.037.058-.131.038-.225Z"/></g><defs><filter id="a" x="0" y="0" width="112.085" height="112" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="3"/><feGaussianBlur stdDeviation="12.5"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_15_1621"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_15_1621" result="shape"/></filter><filter id="b" x="11.726" y="11.711" width="88.631" height="88.578" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="3"/><feGaussianBlur stdDeviation="12.5"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_15_1621"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_15_1621" result="shape"/></filter><clipPath id="c"><path fill="#fff" d="M19.993 19.305h9.698v8.608h-9.698z"/></clipPath></defs></svg>
        </button>

        <div class="flex rounded-lg overflow-hidden border border-transparent focus-within:border-kambista-cyan transition-colors">
          <div class="bg-[#e9ecef] flex-1 py-2 px-4 flex flex-col justify-center">
            <label class="text-xs text-gray-500 font-medium text-left">Entonces recibes</label>
            <input 
              :value="receiveAmount" 
              @input="onReceiveInput" 
              type="number" 
              class="bg-transparent text-lg font-bold text-gray-800 outline-none w-full" 
            />
          </div>
          <div class="bg-[#182233] text-white w-1/3 flex items-center justify-between px-4 cursor-pointer">
            <span class="font-semibold text-sm">{{ receiveCurrency }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center text-sm">
        <div>
          <p class="text-gray-500 text-[11px] leading-tight">Ahorro estimado:</p>
          <p class="font-bold text-gray-800 text-left">S/ {{ ahorroOficial }}</p>
        </div>
        <div class="text-right">
          <p class="text-gray-500 text-[11px] leading-tight">Koinks:</p>
          <p class="font-bold text-gray-800 flex items-center gap-1 justify-end">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {{ koinksGanados }} <span class="text-yellow-400">🪙</span>
          </p>
        </div>
      </div>

      <div class="flex border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div class="px-3 flex items-center text-kambista-cyan bg-white">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
        </div>
        <input type="text" placeholder="Ingresa el cupón" class="flex-1 py-2 px-2 outline-none text-sm bg-white" />
        <button class="bg-[#182233] text-white px-5 text-xs font-semibold tracking-wide hover:bg-gray-800 transition-colors">
          APLICAR
        </button>
      </div>

      <div class="flex items-center justify-center gap-2 text-xs">
        <span class="text-kambista-cyan text-base shrink-0 leading-none mt-0.5">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m15.51 8.08.557 1.102c.1.199.29.342.512.375l5.269.77c.557.078.78.772.379 1.168l-3.81 3.734a.72.72 0 0 0-.2.606l.902 5.276a.682.682 0 0 1-.992.716l-4.711-2.49a.72.72 0 0 0-.635 0l-4.712 2.49a.684.684 0 0 1-.992-.716l.903-5.276a.65.65 0 0 0-.2-.606l-3.81-3.734c-.402-.396-.179-1.09.378-1.167l5.269-.771a.69.69 0 0 0 .512-.375l2.35-4.802a.675.675 0 0 1 1.215 0l.267.54m.769 1.454.122.264m3.699.958 2.517-1.828M7.645 7.596 5.117 5.768M20.8 17.178l2.528 1.83M4.961 17.453l-2.518 1.829" stroke="#0a0f25" stroke-miterlimit="10" stroke-linecap="round"/><path d="m14.573 9.91.357.704c.067.133.19.22.334.243l3.398.495a.442.442 0 0 1 .245.75l-2.462 2.4c-.1.1-.145.243-.123.386l.58 3.403a.438.438 0 0 1-.635.463l-3.041-1.608a.45.45 0 0 0-.413 0l-3.04 1.608c-.324.165-.702-.11-.636-.463l.58-3.403a.44.44 0 0 0-.123-.386l-2.462-2.4c-.256-.254-.122-.706.246-.75l3.397-.495a.45.45 0 0 0 .334-.243l1.515-3.095a.44.44 0 0 1 .791 0l.167.353z" fill="#00e3c2"/></svg>
        </span>
        <p class="text-gray-600 leading-snug">
          ¿Monto mayor a $5,000 o S/18,000?<br>
          <a href="#" class="font-bold text-gray-800 underline decoration-gray-300">¡Obtén un Tipo de Cambio Preferencial!</a>
        </p>
      </div>

    </div>
  </div>

  <button class="w-full max-w-md bg-[#00e3c2] hover:bg-[#00c9ab] text-[#182233] font-bold py-3 rounded-lg mt-4 mb-10 shadow-sm transition-colors uppercase">
    Iniciar Operación
  </button>
</template>