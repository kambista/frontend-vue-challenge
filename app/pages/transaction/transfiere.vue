<script setup lang="ts">
import {
  KAMBISTA_DEPOSIT,
  QUOTE_VALIDITY_MS,
  TRANSACTION_TRANSFER_ILLUSTRATION_SRC,
} from '~/constants/kambistaDeposit'

useHead({
  title: 'Transfiere - Kambista',
})

definePageMeta({
  middleware: 'auth',
})

const tx = useTransactionStore()

if (!tx.hasValidDraft) {
  await navigateTo('/home')
}

function step1Complete() {
  return !!(tx.originBankId && tx.destinationAccountId && tx.sourceFundId)
}

if (!step1Complete()) {
  await navigateTo('/transaction')
}

tx.setStep(2)

const { getBanks } = useKambistaApi()

const { data: banks } = await useAsyncData('transaction-banks', () => getBanks())

const banksList = computed(() => banks.value ?? [])

const selectedOriginBank = computed(() => {
  const id = tx.originBankId
  if (!id)
    return null
  return banksList.value.find(b => String(b.id) === id) ?? null
})

const originBankName = computed(() => selectedOriginBank.value?.name ?? '—')

const sendCurrencyPrefix = computed(() => (tx.mode === 'compra' ? '$' : 'S/'))

const moneyFormatter = new Intl.NumberFormat('es-PE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatSendMoneyDisplay(raw: string) {
  const s = String(raw).trim().replace(/\s/g, '').replace(',', '.')
  const n = Number(s)
  if (!Number.isFinite(n))
    return moneyFormatter.format(0)
  return moneyFormatter.format(n)
}

const montoLine = computed(
  () => `${sendCurrencyPrefix.value} ${formatSendMoneyDisplay(tx.sendAmount)}`,
)

function formatMmSs(totalMs: number) {
  const sec = Math.max(0, Math.floor(totalMs / 1000))
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const quoteCountdownMs = ref(QUOTE_VALIDITY_MS)
const countdownLabel = computed(() => formatMmSs(quoteCountdownMs.value))

let quoteDeadlineAt = 0
let countdownIntervalId: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  quoteDeadlineAt = Date.now() + QUOTE_VALIDITY_MS
  quoteCountdownMs.value = Math.max(0, quoteDeadlineAt - Date.now())
  const tick = () => {
    quoteCountdownMs.value = Math.max(0, quoteDeadlineAt - Date.now())
  }
  tick()
  countdownIntervalId = setInterval(tick, 1000)
})

onBeforeUnmount(() => {
  if (countdownIntervalId !== undefined)
    clearInterval(countdownIntervalId)
})

const copied = ref(false)

async function copyAccountNumber() {
  try {
    await navigator.clipboard.writeText(KAMBISTA_DEPOSIT.accountNumber)
    copied.value = true
    window.setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  catch {
    copied.value = false
  }
}

async function onContinue() {
  tx.setStep(3)
  await navigateTo('/transaction/constancia')
}
</script>

<template>
  <TransactionFlowShell :current-step="2">
    <div
      class="-mx-4 mb-8 bg-[#f4f7f9] px-4 py-3 sm:-mx-6 sm:px-6 flex justify-center"
      role="status"
      aria-live="polite"
    >
      <p class="text-left text-[13px] leading-snug sm:text-[14px]">
        <span class="text-[#6c757d]">El tipo de cambio podría actualizarse en: </span>
        <span class="tabular-nums font-bold text-[#212529]">{{ countdownLabel }}</span>
      </p>
    </div>

    <TransactionStepPanel>
      <div class="mb-6 flex justify-center">
        <img
          :src="'/images/logo_transfiere.png'"
          alt=""
          class="mx-auto h-auto max-h-40 w-full max-w-[220px] object-contain"
          width="220"
          height="160"
        >
      </div>

      <h1 class="mb-3 text-center text-[18px] font-bold leading-snug text-[#09162f] sm:text-[20px]">
        Transfiere a Kambista
      </h1>
      <p class="mb-6 text-center text-[14px] leading-relaxed text-[#4b5568]">
        Transfiere desde tu app bancaria y guarda el
        <span class="font-semibold underline decoration-2 underline-offset-2">número o código de operación</span>
        para el siguiente paso.
      </p>

      <div class="rounded-lg border border-[#e8ecf2] bg-[#fafbfc] p-4 sm:p-5">
        <dl class="space-y-4 text-[14px]">
          <div class="flex justify-between gap-4">
            <dt class="shrink-0 text-[#6b7280]">
              Banco
            </dt>
            <dd class="max-w-[60%] text-right font-semibold text-[#0a1325]">
              {{ originBankName }}
            </dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="shrink-0 text-[#6b7280]">
              Monto
            </dt>
            <dd class="text-right font-semibold text-[#0a1325]">
              {{ montoLine }}
            </dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="shrink-0 text-[#6b7280]">
              Número de cuenta
            </dt>
            <dd class="flex min-w-0 items-center justify-end gap-2">
              <span class="break-all font-mono text-[13px] font-semibold text-[#0a1325]">
                {{ KAMBISTA_DEPOSIT.accountNumber }}
              </span>
              <button
                type="button"
                class="shrink-0 rounded-md p-1.5 text-[#1a253f] transition hover:bg-[#e8f7f5]"
                :aria-label="copied ? 'Copiado' : 'Copiar número de cuenta'"
                @click="copyAccountNumber"
              >
                <svg
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="shrink-0 text-[#6b7280]">
              RUC
            </dt>
            <dd class="text-right font-semibold text-[#0a1325]">
              {{ KAMBISTA_DEPOSIT.ruc }}
            </dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="shrink-0 text-[#6b7280]">
              Titular de la cuenta
            </dt>
            <dd class="max-w-[58%] text-right font-semibold text-[#0a1325]">
              {{ KAMBISTA_DEPOSIT.accountHolder }}
            </dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="shrink-0 text-[#6b7280]">
              Tipo de cuenta
            </dt>
            <dd class="text-right font-semibold text-[#0a1325]">
              {{ KAMBISTA_DEPOSIT.accountType }}
            </dd>
          </div>
        </dl>
      </div>
    </TransactionStepPanel>

    <TransactionStepActions>
      <button
        type="button"
        class="w-full rounded-md bg-[#95e8df] py-3.5 text-center text-[14px] font-semibold uppercase tracking-wide text-[#07122c] transition hover:bg-[#82ddd2] sm:text-[15px]"
        @click="onContinue"
      >
        Ya hice mi transferencia
      </button>
    </TransactionStepActions>
  </TransactionFlowShell>
</template>
