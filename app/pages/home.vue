<script setup lang="ts">
import type { ExchangeCalculateResponse, ExchangeCalculationQuery } from '~/composables/useKambistaApi'
import { getApiErrorMessage } from '~/composables/useAuthApi'

useHead({
  title: 'Inicio - Kambista',
})

definePageMeta({
  middleware: 'auth',
})

const amountSend = ref('')
const amountReceive = ref('')
const couponCode = ref('')

const activeExchangeTab = ref<'compra' | 'venta'>('compra')
const lastAmountEdited = ref<'send' | 'receive'>('send')
const syncingAmounts = ref(false)
const calculateError = ref<string | null>(null)
const tradeBlockedMessage = ref<string | null>(null)

function resetCalcMessages() {
  calculateError.value = null
  tradeBlockedMessage.value = null
}

const { getCurrentExchange, calculateExchange } = useKambistaApi()
const { data: exchangeCurrent, pending: exchangePending, error: exchangeError } = await useAsyncData(
  'exchange-current',
  () => getCurrentExchange(),
)

const rateFormatter = new Intl.NumberFormat('es-PE', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
})

function formatExchangeRate(value: number | undefined) {
  if (value === undefined || Number.isNaN(value))
    return '—'
  return rateFormatter.format(value)
}

function displayTc(side: 'ask' | 'bid') {
  if (exchangePending.value || exchangeError.value || !exchangeCurrent.value)
    return '—'
  return formatExchangeRate(exchangeCurrent.value[side])
}

const displayAsk = computed(() => displayTc('ask'))
const displayBid = computed(() => displayTc('bid'))

const sendCurrencyLabel = computed(() =>
  activeExchangeTab.value === 'compra' ? 'Dólares' : 'Soles',
)

const receiveCurrencyLabel = computed(() =>
  activeExchangeTab.value === 'compra' ? 'Soles' : 'Dólares',
)

const canStartOperation = computed(() => {
  const send = parseAmountInput(amountSend.value)
  const recv = parseAmountInput(amountReceive.value)
  return Number.isFinite(send) && send > 0 && Number.isFinite(recv) && recv > 0
})

function parseAmountInput(raw: string) {
  const s = String(raw).trim().replace(/\s/g, '').replace(',', '.')
  if (s === '' || s === '.')
    return Number.NaN
  const n = Number(s)
  return Number.isFinite(n) ? n : Number.NaN
}

function formatMoneyFromNumber(value: number) {
  if (!Number.isFinite(value))
    return '0.00'
  return value.toFixed(2)
}

function parseNumericUnknown(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v))
    return v
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number.parseFloat(v.replace(',', '.'))
    if (Number.isFinite(n))
      return n
  }
  return undefined
}

function isProbablySpotRate(num: number, res: ExchangeCalculateResponse) {
  const rt = parseNumericUnknown(res.rate)
  const ex = parseNumericUnknown(res.exchange)
  const near = (a: number, b: number | undefined) =>
    b !== undefined && Math.abs(a - b) < 0.02
  return near(num, rt) || near(num, ex)
    || near(num, parseNumericUnknown(res.tc?.ask))
    || near(num, parseNumericUnknown(res.tc?.bid))
}

function getTradeBlockedMessage(res: ExchangeCalculateResponse): string | null {
  const d = res.data
  if (!d || d.operate !== false)
    return null
  if (typeof d.msg === 'string' && d.msg.trim())
    return d.msg
  return 'No es posible operar con este cálculo en este momento.'
}

function resolveRateForTab(res: ExchangeCalculateResponse): number | undefined {
  let rt = parseNumericUnknown(res.rate)
  if (rt !== undefined && rt > 0)
    return rt
  const bid = parseNumericUnknown(res.tc?.bid)
  const ask = parseNumericUnknown(res.tc?.ask)
  const compra = activeExchangeTab.value === 'compra'
  if (compra) {
    if (bid !== undefined && bid > 0)
      return bid
    if (ask !== undefined && ask > 0)
      return ask
  }
  else {
    if (ask !== undefined && ask > 0)
      return ask
    if (bid !== undefined && bid > 0)
      return bid
  }
  const ec = exchangeCurrent.value
  if (ec) {
    const v = compra ? ec.bid : ec.ask
    if (Number.isFinite(v) && v > 0)
      return v
  }
  return undefined
}

function computeDestinationFromResponse(
  res: ExchangeCalculateResponse,
  originAmount: number,
): number | undefined {
  const r = res as Record<string, unknown>
  const ex = parseNumericUnknown(r.exchange)
  if (ex !== undefined && ex > 0)
    return ex

  const compra = activeExchangeTab.value === 'compra'
  const rt = resolveRateForTab(res)
  if (rt !== undefined && rt > 0) {
    const expected = compra ? originAmount * rt : originAmount / rt
    if (Number.isFinite(expected) && expected > 0)
      return expected
  }

  for (const k of ['destinationAmount', 'amountDestination', 'receiveAmount', 'montoDestino'] as const) {
    const num = parseNumericUnknown(r[k])
    if (num !== undefined && num > 0 && !isProbablySpotRate(num, res))
      return num
  }

  if (res.data && typeof res.data === 'object') {
    const d = res.data as Record<string, unknown>
    const nested = parseNumericUnknown(d.destinationAmount) ?? parseNumericUnknown(d.amountDestination)
    if (nested !== undefined && nested > 0)
      return nested
  }

  return undefined
}

function buildForwardCalculateQuery(amount: number): ExchangeCalculationQuery {
  const n = Number(amount)
  const compra = activeExchangeTab.value === 'compra'
  return compra
    ? { originCurrency: 'USD', destinationCurrency: 'PEN', amount: n, active: 'S' as const }
    : { originCurrency: 'PEN', destinationCurrency: 'USD', amount: n, active: 'V' as const }
}

let sendCalculateSeq = 0
let receiveCalculateSeq = 0

async function runCalculateFromSend() {
  if (lastAmountEdited.value !== 'send')
    return
  const n = parseAmountInput(amountSend.value)
  if (!Number.isFinite(n) || n <= 0) {
    syncingAmounts.value = true
    amountReceive.value = ''
    syncingAmounts.value = false
    resetCalcMessages()
    return
  }
  const seq = ++sendCalculateSeq
  resetCalcMessages()
  try {
    const res = await calculateExchange(buildForwardCalculateQuery(n))
    if (seq !== sendCalculateSeq)
      return
    const dest = computeDestinationFromResponse(res, n)
    if (dest === undefined) {
      amountReceive.value = ''
      calculateError.value = 'No se pudo leer el monto calculado.'
      return
    }
    amountReceive.value = formatMoneyFromNumber(dest)
    tradeBlockedMessage.value = getTradeBlockedMessage(res)
  }
  catch (err) {
    calculateError.value = getApiErrorMessage(err)
  }
}

async function runCalculateFromReceive() {
  if (syncingAmounts.value || lastAmountEdited.value !== 'receive')
    return
  const n = parseAmountInput(amountReceive.value)
  if (!Number.isFinite(n) || n <= 0) {
    syncingAmounts.value = true
    amountSend.value = ''
    syncingAmounts.value = false
    resetCalcMessages()
    return
  }
  const seq = ++receiveCalculateSeq
  resetCalcMessages()
  try {
    syncingAmounts.value = true
    const ec = exchangeCurrent.value
    if (!ec) {
      calculateError.value = exchangePending.value
        ? 'Espera un momento a que cargue el tipo de cambio.'
        : 'No hay tipo de cambio disponible para calcular.'
      return
    }

    const compraTab = activeExchangeTab.value === 'compra'
    const anchor = compraTab ? ec.bid : ec.ask
    if (!(anchor > 0)) {
      calculateError.value = 'Tipo de cambio incompleto.'
      return
    }

    const originInQuery = compraTab ? n / anchor : n * anchor
    const res = await calculateExchange(buildForwardCalculateQuery(originInQuery))
    if (seq !== receiveCalculateSeq)
      return
    const dest = computeDestinationFromResponse(res, originInQuery)
    if (dest === undefined) {
      calculateError.value = 'No se pudo leer el monto calculado.'
      return
    }

    amountSend.value = formatMoneyFromNumber(originInQuery)
    amountReceive.value = formatMoneyFromNumber(dest)
    tradeBlockedMessage.value = getTradeBlockedMessage(res)
  }
  catch (err) {
    calculateError.value = getApiErrorMessage(err)
  }
  finally {
    syncingAmounts.value = false
  }
}

watch(amountSend, () => {
  if (lastAmountEdited.value !== 'send')
    return
  void runCalculateFromSend()
})

watch(amountReceive, () => {
  if (syncingAmounts.value || lastAmountEdited.value !== 'receive')
    return
  void runCalculateFromReceive()
})

function onSendAmountInput(raw: string) {
  lastAmountEdited.value = 'send'
  const s = sanitizeAmount(raw)
  amountSend.value = s
  if (s === '' || s === '.') {
    syncingAmounts.value = true
    amountReceive.value = ''
    resetCalcMessages()
    syncingAmounts.value = false
  }
}

function onReceiveAmountInput(raw: string) {
  lastAmountEdited.value = 'receive'
  const s = sanitizeAmount(raw)
  amountReceive.value = s
  if (s === '' || s === '.') {
    syncingAmounts.value = true
    amountSend.value = ''
    resetCalcMessages()
    syncingAmounts.value = false
  }
}

function setExchangeTab(tab: 'compra' | 'venta') {
  if (activeExchangeTab.value === tab)
    return
  activeExchangeTab.value = tab
  amountReceive.value = ''
  resetCalcMessages()
  lastAmountEdited.value = 'send'
  nextTick(() => {
    void runCalculateFromSend()
  })
}

function toggleExchangeTab() {
  setExchangeTab(activeExchangeTab.value === 'compra' ? 'venta' : 'compra')
}

function sanitizeAmount(raw: string) {
  let s = raw.replace(/[^\d.]/g, '')
  const dot = s.indexOf('.')
  if (dot === -1)
    return s
  const intPart = s.slice(0, dot)
  const dec = s.slice(dot + 1).replace(/\./g, '').slice(0, 2)
  return dec.length ? `${intPart}.${dec}` : `${intPart}.`
}

const auth = useAuthStore()
const transaction = useTransactionStore()
const profileMenuOpen = ref(false)
const profileMenuRoot = ref<HTMLElement | null>(null)
const profileMenuId = useId()

const profileDisplayName = computed(() => {
  const raw = auth.user?.nombresCompletos?.trim()
  if (!raw)
    return 'María'
  const first = raw.split(/\s+/)[0] ?? raw
  return first.toLocaleUpperCase('es-PE')
})

function closeProfileMenu() {
  profileMenuOpen.value = false
}

function toggleProfileMenu() {
  profileMenuOpen.value = !profileMenuOpen.value
}

async function onLogout() {
  await auth.logout()
  profileMenuOpen.value = false
  await navigateTo('/auth/login')
}

async function startOperacion() {
  if (!canStartOperation.value || exchangePending.value || !exchangeCurrent.value)
    return
  const ec = exchangeCurrent.value
  transaction.setFromHome({
    sendAmount: amountSend.value,
    receiveAmount: amountReceive.value,
    couponCode: couponCode.value,
    mode: activeExchangeTab.value,
    rateAsk: ec.ask,
    rateBid: ec.bid,
  })
  await navigateTo('/transaction')
}

function onProfileDocumentPointerDown(event: PointerEvent) {
  const el = profileMenuRoot.value
  if (!el || !profileMenuOpen.value)
    return
  if (!el.contains(event.target as Node))
    closeProfileMenu()
}

function onProfileKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && profileMenuOpen.value)
    closeProfileMenu()
}

onMounted(() => {
  document.addEventListener('pointerdown', onProfileDocumentPointerDown, true)
  document.addEventListener('keydown', onProfileKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onProfileDocumentPointerDown, true)
  document.removeEventListener('keydown', onProfileKeydown)
})
</script>

<template>
  <div class="min-h-screen bg-white text-[#0a1325]">
    <div class="flex min-h-screen w-full">
      <aside class="hidden shrink-0 border-r border-[#e6e8ee] bg-white xl:flex xl:w-[320px] xl:min-w-[320px] xl:flex-col">
        <div class="flex h-[84px] w-full items-center border-b border-[#eceef3] px-5">
          <div class="flex min-w-0 items-center gap-3" aria-label="Kambista">
            <img
              src="/images/logo_kambista.png"
              alt=""
              width="40"
              height="40"
              class="h-9 w-auto shrink-0 object-contain sm:h-10"
              role="presentation"
            >
            <span class="select-none text-[1.35rem] font-bold leading-none tracking-tight text-[#09162f] sm:text-[1.4rem]">
              Kamb<span class="relative inline-block">i<span class="pointer-events-none absolute -top-1 left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-[2px] bg-teal-500" aria-hidden="true" /></span>sta
            </span>
          </div>
        </div>

        <nav class="w-full py-5 pl-4 pr-3 xl:pl-5 xl:pr-4">
          <ul class="space-y-1 text-[14px] leading-snug">
            <li class="w-full">
              <a href="#" class="flex w-full min-w-0 items-center gap-3 rounded-md bg-[#f1f5fb] px-3 py-2.5 font-medium xl:px-3.5">
                <span class="flex h-7 w-7 items-center justify-center rounded-full border border-[#d9deea]">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 11.5L12 4l9 7.5M6 10v9h12v-9" />
                  </svg>
                </span>
                <span class="min-w-0 flex-1">Inicio</span>
              </a>
            </li>
            <li class="w-full">
              <a href="#" class="flex w-full min-w-0 items-center gap-3 rounded-md px-3 py-2.5 hover:bg-slate-50 xl:px-3.5">
                <span class="flex h-7 w-7 items-center justify-center rounded-full border border-[#d9deea]">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 7h12M8 12h12M8 17h12M3 7h.01M3 12h.01M3 17h.01" />
                  </svg>
                </span>
                <span class="min-w-0 flex-1">Historial de operaciones</span>
              </a>
            </li>
            <li class="w-full">
              <a href="#" class="flex w-full min-w-0 items-center gap-3 rounded-md px-3 py-2.5 hover:bg-slate-50 xl:px-3.5">
                <span class="flex h-7 w-7 items-center justify-center rounded-full border border-[#d9deea]">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 7h18M3 12h18M3 17h18" />
                  </svg>
                </span>
                <span class="min-w-0 flex-1">Cuentas bancarias</span>
              </a>
            </li>
            <li class="w-full">
              <a href="#" class="flex w-full min-w-0 items-center gap-3 rounded-md px-3 py-2.5 hover:bg-slate-50 xl:px-3.5">
                <span class="flex h-7 w-7 items-center justify-center rounded-full border border-[#d9deea]">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3v18M3 12h18" />
                  </svg>
                </span>
                <span class="min-w-0 flex-1">Regala y gana</span>
              </a>
            </li>
            <li class="w-full">
              <a href="#" class="flex w-full min-w-0 items-center gap-3 rounded-md px-3 py-2.5 hover:bg-slate-50 xl:px-3.5">
                <span class="flex h-7 w-7 items-center justify-center rounded-full border border-[#d9deea]">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 12h4l3-9 4 18 3-9h4" />
                  </svg>
                </span>
                <span class="min-w-0 flex-1">Alertas de tipo de cambio</span>
              </a>
            </li>
            <li class="w-full">
              <a href="#" class="flex w-full min-w-0 items-center gap-3 rounded-md px-3 py-2.5 hover:bg-slate-50 xl:px-3.5">
                <span class="flex h-7 w-7 items-center justify-center rounded-full border border-[#d9deea]">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke-width="1.8" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 7v5l3 3" />
                  </svg>
                </span>
                <span class="min-w-0 flex-1">Kambi Koinks</span>
                <span class="shrink-0 rounded-full bg-[#09162f] px-2 py-0.5 text-[10px] font-bold uppercase text-white">Nuevo</span>
              </a>
            </li>
            <li class="w-full">
              <a href="#" class="flex w-full min-w-0 items-center gap-3 rounded-md px-3 py-2.5 hover:bg-slate-50 xl:px-3.5">
                <span class="flex h-7 w-7 items-center justify-center rounded-full border border-[#d9deea]">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke-width="1.8" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.5 9a2.5 2.5 0 015 0c0 1.6-2.5 1.8-2.5 3.5M12 17h.01" />
                  </svg>
                </span>
                <span class="min-w-0 flex-1">Ayuda</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <div class="flex min-h-screen min-w-0 flex-1 flex-col bg-[#f4f6f9]">
        <header class="border-b border-[#e6e8ee] bg-white">
          <div class="flex h-[84px] items-center justify-between gap-4 px-4 sm:px-6 xl:px-7">
            <div class="flex items-center gap-2.5">
              <span class="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#e2e6ef] bg-white">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 18l-6-6 6-6" />
                </svg>
              </span>
              <h1 class="text-[34px] font-bold leading-none xl:text-[42px]">
                Inicio
              </h1>
            </div>

            <p class="hidden text-center text-[13px] font-semibold leading-tight text-[#1d2740] lg:block">
              Horario: Lunes a viernes 9:00 am a 7:00 pm
              <br>
              Sábados de 09:00 am a 2:00 pm
            </p>

            <div class="flex items-center gap-4">
              <p class="hidden text-[13px] font-semibold text-[#1d2740] sm:block">
                Tienes <span class="font-bold">2500</span> Koinks
              </p>
              <div ref="profileMenuRoot" class="relative shrink-0">
                <button
                  type="button"
                  class="flex items-center gap-2 rounded-sm border border-[#d8dde8] px-2 py-1.5 text-[#1d2740]"
                  :aria-expanded="profileMenuOpen"
                  aria-haspopup="menu"
                  :aria-controls="profileMenuId"
                  @click.stop="toggleProfileMenu"
                >
                  <span class="flex h-5 w-5 items-center justify-center rounded border border-[#d8dde8]">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                      <circle cx="12" cy="8" r="3.2" stroke-width="1.8" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5.5 20a6.5 6.5 0 0113 0" />
                    </svg>
                  </span>
                  <span class="text-xs font-semibold uppercase tracking-wide">{{ profileDisplayName }}</span>
                  <svg class="h-3.5 w-3.5 shrink-0 text-[#1d2740]" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div
                  v-show="profileMenuOpen"
                  :id="profileMenuId"
                  class="absolute right-0 top-full z-10 mt-1 min-w-[11rem] rounded-sm border border-[#d8dde8] bg-white py-1 shadow-sm"
                  role="menu"
                  aria-label="Cuenta de usuario"
                >
                  <button
                    type="button"
                    role="menuitem"
                    class="w-full px-3 py-2.5 text-left text-[13px] font-semibold text-[#1d2740] hover:bg-slate-50"
                    @click="onLogout"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main class="flex-1 px-4 py-9 sm:px-6 xl:px-7">
          <div class="mx-auto mb-6 flex max-w-[640px] gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 xl:hidden">
            <button type="button" class="whitespace-nowrap rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900">
              Inicio
            </button>
            <button type="button" class="whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold text-slate-600">
              Historial
            </button>
            <button type="button" class="whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold text-slate-600">
              Cuentas
            </button>
            <button type="button" class="whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold text-slate-600">
              Beneficios
            </button>
          </div>

          <section class="mx-auto w-full max-w-[620px] rounded bg-white p-3 sm:p-5 xl:p-6">
            <div class="grid grid-cols-2 overflow-hidden rounded-[3px] text-center text-[14px] font-bold leading-none sm:text-[15px] xl:text-[16px]">
              <button
                type="button"
                class="cursor-pointer px-3 py-3 transition-colors"
                :class="
                  activeExchangeTab === 'compra'
                    ? 'bg-[#07122c] text-white'
                    : 'border border-[#eff1f5] bg-white text-[#c1c4cc]'
                "
                @click="setExchangeTab('compra')"
              >
                Compra: {{ displayBid }}
              </button>
              <button
                type="button"
                class="cursor-pointer px-3 py-3 transition-colors"
                :class="
                  activeExchangeTab === 'venta'
                    ? 'bg-[#07122c] text-white'
                    : 'border border-[#eff1f5] bg-white text-[#c1c4cc]'
                "
                @click="setExchangeTab('venta')"
              >
                Venta: {{ displayAsk }}
              </button>
            </div>
            <p
              v-if="exchangeError"
              class="mt-2 text-center text-[13px] text-red-600"
              role="alert"
            >
              No se pudo cargar el tipo de cambio.
            </p>
            <p
              v-if="calculateError"
              class="mt-2 text-center text-[13px] text-red-600"
              role="alert"
            >
              {{ calculateError }}
            </p>
            <p
              v-if="tradeBlockedMessage"
              class="mt-2 text-center text-[13px] text-amber-800"
              role="status"
            >
              {{ tradeBlockedMessage }}
            </p>

            <div class="relative mt-4 space-y-3">
              <button
                type="button"
                class="absolute left-1/2 top-1/2 z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#dbe4ee] bg-white text-neutral-900 shadow-[0_2px_8px_rgba(15,23,42,0.08),0_0_22px_rgba(219,228,239,0.95),0_0_1px_rgba(148,163,184,0.35)] transition hover:border-[#cdd9e8] hover:shadow-[0_4px_14px_rgba(15,23,42,0.1),0_0_28px_rgba(219,228,239,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#07122c] active:scale-[0.97]"
                aria-label="Cambiar entre compra y venta"
                @click="toggleExchangeTab"
              >
                <svg
                  class="h-5 w-5 shrink-0 text-neutral-900 [shape-rendering:geometricPrecision]"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
                  />
                </svg>
              </button>

              <div class="grid min-w-0 grid-cols-1 overflow-hidden rounded-t-[3px] border-b-2 border-white sm:grid-cols-[minmax(0,1fr)_9.5rem] xl:grid-cols-[minmax(0,1fr)_11rem]">
                <div class="min-w-0 bg-[#efefef] px-3 py-2.5 sm:px-4">
                  <AppInput
                    :model-value="amountSend"
                    placeholder="0.00"
                    label="¿Cuánto envías?"
                    variant="amount"
                    inputmode="decimal"
                    id="amount-send"
                    autocomplete="off"
                    @update:model-value="onSendAmountInput($event)"
                  />
                </div>
                <button
                  type="button"
                  class="flex min-h-[3.75rem] min-w-0 cursor-pointer items-center border-b border-white/90 bg-[#07122c] px-3 py-2.5 text-left text-white sm:min-h-0 sm:self-stretch sm:px-3.5"
                >
                  <span class="min-w-0 flex-1 text-center text-lg font-semibold leading-tight sm:text-xl xl:text-2xl">
                    {{ sendCurrencyLabel }}
                  </span>
                </button>
              </div>

              <div class="grid min-w-0 grid-cols-1 overflow-hidden rounded-b-[3px] sm:grid-cols-[minmax(0,1fr)_9.5rem] xl:grid-cols-[minmax(0,1fr)_11rem]">
                <div class="min-w-0 bg-[#efefef] px-3 py-2.5 sm:px-4">
                  <AppInput
                    :model-value="amountReceive"
                    placeholder="0.00"
                    label="Entonces recibes"
                    variant="amount"
                    inputmode="decimal"
                    id="amount-receive"
                    autocomplete="off"
                    @update:model-value="onReceiveAmountInput($event)"
                  />
                </div>
                <button
                  type="button"
                  class="flex min-h-[3.75rem] min-w-0 cursor-pointer items-center bg-[#07122c] px-3 py-2.5 text-left text-white sm:min-h-0 sm:self-stretch sm:px-3.5"
                >
                  <span class="min-w-0 flex-1 text-center text-lg font-semibold leading-tight sm:text-xl xl:text-2xl">
                    {{ receiveCurrencyLabel }}
                  </span>
                </button>
              </div>
            </div>

            <div class="my-6 flex items-end justify-between gap-4 text-sm text-[#1a253f] sm:text-[15px]">
              <p class="min-w-0 leading-tight">
                Ahorro estimado:
                <br>
                <span class="text-2xl font-bold leading-tight text-[#0a1325] sm:text-[26px] xl:text-xl">S/ 555.00</span>
              </p>
              <p class="min-w-0 text-right leading-tight">
                Koinks:
                <br>
                <span class="text-2xl font-bold leading-tight text-[#0a1325] sm:text-[26px] xl:text-xl">10,000</span>
              </p>
            </div>

            <div class="mt-4 flex min-h-[52px] overflow-hidden rounded-xl border border-[#dfe4ec] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
              <div class="flex min-w-0 flex-1 items-center gap-3 py-2.5 pl-3 pr-2 sm:pl-4">
                <label for="coupon-code" class="sr-only">Cupón</label>
                <span
                  class="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#07122c]"
                  aria-hidden="true"
                >
                  <svg
                    class="absolute h-8 w-8 text-white/30"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.586 2.586A2 2 0 0114 2h5a1 1 0 011 1v5a2 2 0 01-.586 1.414l-7.793 7.793a3 3 0 01-4.243 0l-2.5-2.5a3 3 0 010-4.243l7.793-7.793zM15 6a1 1 0 100-2 1 1 0 000 2z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="relative z-10 text-sm font-extrabold leading-none text-white">%</span>
                </span>
                <input
                  id="coupon-code"
                  v-model="couponCode"
                  type="text"
                  name="coupon"
                  autocomplete="off"
                  placeholder="Ingresa el cupón"
                  class="min-w-0 flex-1 border-0 bg-transparent py-1 text-sm text-[#0a1325] outline-none ring-0 placeholder:text-[#bcc1cb] focus:ring-0"
                >
              </div>
              <button
                type="button"
                class="shrink-0 bg-[#07122c] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#0a1f3d] sm:px-5"
              >
                Aplicar
              </button>
            </div>

            <div class="my-6 flex items-center justify-center gap-2 text-[14px] leading-tight text-[#17233d]">
              <svg class="mt-4 h-10 w-10 shrink-0 text-cyan-500" viewBox="0 0 7/8 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3l2.3 4.7 5.2.8-3.8 3.8.9 5.2L12 15.8 7.4 17.5l.9-5.2L4.5 8.5l5.2-.8L12 3z" />
              </svg>
              <p class="text-center">
                ¿Monto mayor a $5.000 o S/18,000? <br>
                <a href="#" class="font-bold underline" @click.prevent>¡Obtén un Tipo de Cambio Preferencial!</a>
              </p>
            </div>
          </section>

          <div class="mx-auto mt-8 w-full max-w-[620px]">
            <button
              type="button"
              class="w-full rounded-md bg-[#95e8df] py-3 text-center text-[16px] font-semibold uppercase tracking-wide text-[#07122c] transition enabled:hover:bg-[#82ddd2] disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!canStartOperation || exchangePending || !exchangeCurrent"
              @click="startOperacion"
            >
              Iniciar operación
            </button>
          </div>
        </main>
      </div>
    </div>

    <FloatingWhatsAppButton />
  </div>
</template>
