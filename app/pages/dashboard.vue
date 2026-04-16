<script setup lang="ts">
import { useOperationStore } from "~/stores/operation"

definePageMeta({ layout: "default" })
useHead({ title: "Inicio | Kambista" })

const operationStore = useOperationStore()

// ── Tipo de cambio desde API ─────────────────────────────────────────────────
interface ExchangeRate {
  compra: number
  venta: number
  previousCompra?: number
  previousVenta?: number
}

const rate = ref<ExchangeRate>({ compra: 0, venta: 0 })
const rateLoading = ref(true)
const rateError = ref(false)

async function fetchExchangeRate() {
  try {
    rateLoading.value = true
    rateError.value = false
    const response = await $fetch<any>('https://api.kambista.com/v1/exchange/kambista/current')
    // La API puede devolver distintas estructuras; intentamos adaptarla
    const data = response?.data ?? response
    rate.value = {
      compra: data?.compra ?? data?.buyRate ?? data?.buy ?? data?.bid ?? 0,
      venta: data?.venta ?? data?.sellRate ?? data?.sell ?? data?.ask ?? 0,
      previousCompra: data?.previousCompra ?? data?.prevBuy ?? undefined,
      previousVenta: data?.previousVenta ?? data?.prevSell ?? undefined,
    }
  } catch {
    rateError.value = true
    // Fallback a valores predeterminados si la API falla
    rate.value = { compra: 3.755, venta: 3.780 }
  } finally {
    rateLoading.value = false
  }
}

// Obtener tipo de cambio al cargar y refrescar cada 60 s
onMounted(async () => {
  // Asegurar que tenemos valores iniciales antes de la primera llamada
  if (rate.value.compra === 0) {
    rate.value = { compra: 3.755, venta: 3.780 }
  }

  try {
    await fetchExchangeRate()
  } catch (err) {
    console.error('Error fetching initial rates:', err)
  }

  // Trigger initial calculation
  const amount = parseFloat(sendAmount.value.replace(/,/g, "")) || 0
  if (amount > 0) {
    calculateWithApi(amount)
  }
  
  const interval = setInterval(fetchExchangeRate, 60000)
  onUnmounted(() => clearInterval(interval))
})

// ── Estado del formulario ────────────────────────────────────────────────────
const activeTab = ref<"compra" | "venta">("compra")
const sendAmount = ref("1000")
const isCalculating = ref(false)
const calculatedReceive = ref<string | null>(null)

// Las monedas cambian según la pestaña activa
const sendCurrency = computed(() => activeTab.value === "compra" ? "USD" : "PEN")
const receiveCurrency = computed(() => activeTab.value === "compra" ? "PEN" : "USD")
const currentRate = computed(() => activeTab.value === "compra" ? rate.value.compra : rate.value.venta)
const previousRate = computed(() =>
  activeTab.value === "compra"
    ? (rate.value.previousCompra ?? rate.value.compra)
    : (rate.value.previousVenta ?? rate.value.venta)
)

// ── Calculadora con debounce usando la API ───────────────────────────────────
const debouncedCalcTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const receiveAmount = computed(() => {
  if (calculatedReceive.value !== null) return calculatedReceive.value
  if (!currentRate.value) return "0.00"
  const amount = parseFloat(sendAmount.value.replace(/,/g, "")) || 0
  if (activeTab.value === "compra") {
    return (amount * currentRate.value).toFixed(2)
  } else {
    return (amount / currentRate.value).toFixed(2)
  }
})

async function calculateWithApi(amount: number) {
  if (amount <= 0 || !currentRate.value) {
    calculatedReceive.value = null
    return
  }
  try {
    isCalculating.value = true
    const originCurrency = sendCurrency.value
    const destinationCurrency = receiveCurrency.value
    const response = await $fetch<any>(
      `https://api.kambista.com/v1/exchange/calculates?originCurrency=${originCurrency}&destinationCurrency=${destinationCurrency}&amount=${amount}&active=S`
    )
    const data = response?.data ?? response
    // Try to find the amount in various possible fields
    const received = data?.destinationAmount ?? data?.amount ?? data?.receiveAmount ?? data?.result ?? data?.exchange ?? null
    calculatedReceive.value = received !== null ? Number(received).toFixed(2) : null
  } catch {
    calculatedReceive.value = null
  } finally {
    isCalculating.value = false
  }
}

function onSendAmountChange() {
  calculatedReceive.value = null
  if (debouncedCalcTimer.value) clearTimeout(debouncedCalcTimer.value)
  const amount = parseFloat(sendAmount.value.replace(/,/g, "")) || 0
  debouncedCalcTimer.value = setTimeout(() => calculateWithApi(amount), 600)
}

watch(activeTab, () => {
  calculatedReceive.value = null
  const amount = parseFloat(sendAmount.value.replace(/,/g, "")) || 0
  if (amount > 0) calculateWithApi(amount)
})

watch(rate, () => {
  const amount = parseFloat(sendAmount.value.replace(/,/g, "")) || 0
  if (amount > 0) calculateWithApi(amount)
})

// ── Ahorro estimado ──────────────────────────────────────────────────────────
const savingsEstimate = computed(() => {
  const amount = parseFloat(sendAmount.value.replace(/,/g, "")) || 0
  return (amount * 0.055).toFixed(2)
})

// ── Koinks estimados ────────────────────────────────────────────────────────────
const estimatedKoinks = computed(() => {
  const received = parseFloat(receiveAmount.value) || 0
  // Fórmula: 0.5% de lo recibido
  return Math.floor(received * 0.005)
})

// ── Cupón ────────────────────────────────────────────────────────────────────
const couponCode = ref("")
const couponApplied = ref(false)
const couponError = ref("")

function applyCoupon() {
  if (!couponCode.value.trim()) return
  if (couponCode.value.toUpperCase() === "KAMBISTA") {
    couponApplied.value = true
    couponError.value = ""
  } else {
    couponError.value = "Cupón inválido"
    couponApplied.value = false
  }
}

// ── Monedas ──────────────────────────────────────────────────────────────────
const sendCurrencyOpen = ref(false)
const receiveCurrencyOpen = ref(false)

function selectSendCurrency(currency: string) {
  if ((currency === "USD" && activeTab.value !== "compra") || (currency === "PEN" && activeTab.value !== "venta")) {
    swapCurrencies()
  }
  sendCurrencyOpen.value = false
}

function selectReceiveCurrency(currency: string) {
  if ((currency === "PEN" && activeTab.value !== "compra") || (currency === "USD" && activeTab.value !== "venta")) {
    swapCurrencies()
  }
  receiveCurrencyOpen.value = false
}

function swapCurrencies() {
  activeTab.value = activeTab.value === "compra" ? "venta" : "compra"
  calculatedReceive.value = null
}

// ── Iniciar operación ────────────────────────────────────────────────────────
function startOperation() {
  const amount = parseFloat(sendAmount.value.replace(/,/g, "")) || 0
  operationStore.setStep(1)
  operationStore.updateOperation({
    operationType: activeTab.value,
    sendAmount: amount,
    sendCurrency: sendCurrency.value as "USD" | "PEN",
    receiveAmount: parseFloat(receiveAmount.value),
    receiveCurrency: receiveCurrency.value as "USD" | "PEN",
    currentRate: currentRate.value,
    previousRate: previousRate.value,
    coupon: couponApplied.value ? couponCode.value : null,
  })
  navigateTo("/operacion/transfiere")
}
</script>

<template>
  <div class="flex justify-center py-4">
    <div class="w-full max-w-[420px] flex flex-col gap-3">

      <!-- Widget Card -->
      <div class="bg-white rounded-2xl overflow-hidden shadow-card">

        <!-- Tabs / Tasas -->
        <div class="flex">
          <button
            :class="[
              'flex-1 py-4 text-center font-bold text-lg transition-colors',
              activeTab === 'compra'
                ? 'bg-[#060f26] text-white'
                : 'bg-white text-gray-400 hover:text-gray-500',
            ]"
            @click="activeTab = 'compra'"
          >
            <span v-if="rateLoading" class="animate-pulse">Compra: —</span>
            <span v-else>Compra: {{ rate.compra ? rate.compra.toFixed(3) : '—' }}</span>
          </button>
          <button
            :class="[
              'flex-1 py-4 text-center font-bold text-lg transition-colors',
              activeTab === 'venta'
                ? 'bg-[#060f26] text-white'
                : 'bg-white text-gray-400 hover:text-gray-500',
            ]"
            @click="activeTab = 'venta'"
          >
            <span v-if="rateLoading" class="animate-pulse">Venta: —</span>
            <span v-else>Venta: {{ rate.venta ? rate.venta.toFixed(3) : '—' }}</span>
          </button>
        </div>

        <!-- Error banner -->
        <div v-if="rateError" class="bg-amber-50 border-b border-amber-100 px-4 py-2 text-xs text-amber-700 text-center">
          Usando tipo de cambio referencial. Intenta refrescar.
          <button class="underline ml-1 font-semibold" @click="fetchExchangeRate">Actualizar</button>
        </div>

        <!-- Body -->
        <div class="p-5 flex flex-col gap-4">

          <!-- Inputs container: position relative so swap btn can be absolute -->
          <div class="relative flex flex-col gap-3">

            <!-- Send Row -->
            <div class="flex items-stretch rounded-xl border border-gray-200 shadow-sm overflow-visible">
              <div class="flex-1 px-4 py-3 bg-white rounded-l-xl">
                <p class="text-xs text-gray-400 mb-1">¿Cuánto envías?</p>
                <input
                  v-model="sendAmount"
                  type="text"
                  inputmode="decimal"
                  class="text-2xl font-bold text-[#111827] bg-transparent outline-none w-full placeholder-gray-300
                         focus:ring-0 transition-colors"
                  placeholder="0.00"
                  @input="onSendAmountChange"
                />
              </div>
              <div class="relative flex-shrink-0">
                <button
                  class="h-full bg-[#060f26] text-white px-4 flex items-center gap-2 font-semibold text-sm min-w-[110px] justify-between hover:bg-[#0a1a40] transition-colors rounded-r-xl"
                  @click="sendCurrencyOpen = !sendCurrencyOpen"
                >
                  <span>{{ sendCurrency === 'USD' ? 'Dólares' : 'Soles' }}</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div v-if="sendCurrencyOpen" class="absolute right-0 top-full mt-1 z-[60] bg-white border border-gray-100 rounded-lg shadow-2xl min-w-[140px] py-1">
                  <button
                    class="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm flex items-center justify-between"
                    :class="sendCurrency === 'USD' ? 'text-[#111760] font-bold' : 'text-gray-700'"
                    @click="selectSendCurrency('USD')"
                  >
                    <span>Dólares</span>
                    <span v-if="sendCurrency === 'USD'" class="text-[#4EC9C0]">✓</span>
                  </button>
                  <button
                    class="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm flex items-center justify-between"
                    :class="sendCurrency === 'PEN' ? 'text-[#111760] font-bold' : 'text-gray-700'"
                    @click="selectSendCurrency('PEN')"
                  >
                    <span>Soles</span>
                    <span v-if="sendCurrency === 'PEN'" class="text-[#4EC9C0]">✓</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Swap button: absolute, vertically centered between the two rows, right-aligned beside the select -->
            <button
              class="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-[130px] z-10
                     w-10 h-10 rounded-full bg-white border-2 border-gray-200 shadow-md
                     flex items-center justify-center
                     hover:border-[#4EC9C0] hover:shadow-lg transition-all"
              @click="swapCurrencies"
              title="Invertir monedas"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/>
                <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
              </svg>
            </button>

            <!-- Receive Row -->
            <div class="flex items-stretch rounded-xl border border-gray-200 shadow-sm">
              <div class="flex-1 px-4 py-3 bg-white rounded-l-xl">
                <p class="text-xs text-gray-400 mb-1">Entonces recibes</p>
                <div class="flex items-center gap-2">
                  <input
                    :value="receiveAmount"
                    type="text"
                    class="text-2xl font-bold text-[#111827] bg-transparent outline-none w-full cursor-default placeholder-gray-300"
                    readonly
                  />
                  <svg v-if="isCalculating" class="animate-spin flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#4EC9C0" stroke-width="3" stroke-dasharray="30" stroke-dashoffset="10"/>
                  </svg>
                </div>
              </div>
              <div class="relative flex-shrink-0">
                <button
                  class="h-full bg-[#060f26] text-white px-4 flex items-center gap-2 font-semibold text-sm min-w-[110px] justify-between hover:bg-[#0a1a40] transition-colors rounded-r-xl"
                  @click="receiveCurrencyOpen = !receiveCurrencyOpen"
                >
                  <span>{{ receiveCurrency === 'PEN' ? 'Soles' : 'Dólares' }}</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div v-if="receiveCurrencyOpen" class="absolute right-0 top-full mt-1 z-[60] bg-white border border-gray-100 rounded-lg shadow-2xl min-w-[140px] py-1">
                  <button
                    class="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm flex items-center justify-between"
                    :class="receiveCurrency === 'PEN' ? 'text-[#111760] font-bold' : 'text-gray-700'"
                    @click="selectReceiveCurrency('PEN')"
                  >
                    <span>Soles</span>
                    <span v-if="receiveCurrency === 'PEN'" class="text-[#4EC9C0]">✓</span>
                  </button>
                  <button
                    class="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm flex items-center justify-between"
                    :class="receiveCurrency === 'USD' ? 'text-[#111760] font-bold' : 'text-gray-700'"
                    @click="selectReceiveCurrency('USD')"
                  >
                    <span>Dólares</span>
                    <span v-if="receiveCurrency === 'USD'" class="text-[#4EC9C0]">✓</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          <!-- Savings + Koinks -->
          <div class="flex justify-between items-center text-sm text-gray-600">
            <span>Ahorro estimado: <strong class="text-gray-800">S/ {{ savingsEstimate }}</strong></span>
            <span class="flex items-center gap-1 text-gray-600">
              Koinks estimados:
              <strong class="text-gray-800">{{ estimatedKoinks.toLocaleString() }}</strong>
              <span><img src="/images/dashboard/koinks.png" alt="Koinks" class="w-4 h-4" /></span>
            </span>
          </div>

          <!-- Coupon -->
          <div class="mt-3">
            <div class="flex rounded-xl border border-gray-200 overflow-hidden">
              <div class="flex items-center pl-3">
                <img src="/images/dashboard/cupon_calculadora.png" alt="Cupón" class="w-6 h-6 object-contain" />
              </div>
              <input
                v-model="couponCode"
                type="text"
                class="flex-1 px-3 py-3 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
                placeholder="Ingresa el cupón"
                :disabled="couponApplied"
              />
              <button
                :class="[
                  'bg-[#060f26] text-white px-5 text-xs font-bold tracking-widest transition-opacity',
                  couponApplied ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90',
                ]"
                :disabled="couponApplied"
                @click="applyCoupon"
              >
                APLICAR
              </button>
            </div>
            <p v-if="couponError" class="text-red-500 text-xs mt-1">{{ couponError }}</p>
            <p v-if="couponApplied" class="text-[#4EC9C0] text-xs mt-1 font-semibold">✓ Cupón aplicado</p>
          </div>

          <!-- Preference Notice -->
          <div class="mt-2 py-3 flex flex-row items-center justify-center gap-2">
            <img
              src="/images/dashboard/star.png"
              alt=""
              class="w-5 h-5 flex-shrink-0 object-contain"
              aria-hidden="true"
            />
            <div class="flex flex-col">
              <p class="text-gray-500 text-xs">¿Monto mayor a $5.000 o S/18.000?</p>
              <p class="text-[#060f26] text-xs font-bold cursor-pointer underline">¡Obtén un Tipo de Cambio Preferencial!</p>
            </div>
          </div>

        </div>
      </div>

      <!-- CTA Button -->
      <button
        class="w-full py-4 font-bold text-sm tracking-widest rounded-xl transition-colors"
        :class="currentRate > 0
          ? 'bg-[#4EC9C0] text-white hover:bg-[#3ABFB7]'
          : 'bg-[#4EC9C0]/60 text-white cursor-not-allowed'"
        :disabled="currentRate <= 0"
        @click="startOperation"
      >
        INICIAR OPERACIÓN
      </button>

    </div>
  </div>

  <WhatsAppButton />
</template>
