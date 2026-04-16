import { defineStore } from 'pinia'

export type TransactionMode = 'compra' | 'venta'

export interface TransactionFromHomePayload {
  sendAmount: string
  receiveAmount: string
  couponCode: string
  mode: TransactionMode
  rateAsk: number
  rateBid: number
}

/** Datos mostrados en la pantalla «Constancia enviada» (tras enviar; se limpia con `reset`). */
export interface TransactionCompletionSnapshot {
  kambistaCode: string
  receiveDisplay: string
  waitLabel: string
}

function parseAmount(raw: string) {
  const s = String(raw).trim().replace(/\s/g, '').replace(',', '.')
  if (s === '' || s === '.')
    return Number.NaN
  const n = Number(s)
  return Number.isFinite(n) ? n : Number.NaN
}

export const useTransactionStore = defineStore('transaction', () => {
  const sendAmount = ref('')
  const receiveAmount = ref('')
  const couponCode = ref('')
  const mode = ref<TransactionMode>('compra')
  const rateAsk = ref(0)
  const rateBid = ref(0)

  const currentStep = ref<1 | 2 | 3>(1)

  const originBankId = ref<string | null>(null)
  const destinationAccountId = ref<string | null>(null)
  const sourceFundId = ref<string | null>(null)

  const voucherFileName = ref<string | null>(null)

  const completionSnapshot = ref<TransactionCompletionSnapshot | null>(null)

  const draftStarted = ref(false)

  const hasValidDraft = computed(() => {
    if (!draftStarted.value)
      return false
    const send = parseAmount(sendAmount.value)
    const recv = parseAmount(receiveAmount.value)
    return Number.isFinite(send) && send > 0 && Number.isFinite(recv) && recv > 0
  })

  function setFromHome(payload: TransactionFromHomePayload) {
    sendAmount.value = payload.sendAmount
    receiveAmount.value = payload.receiveAmount
    couponCode.value = payload.couponCode
    mode.value = payload.mode
    rateAsk.value = payload.rateAsk
    rateBid.value = payload.rateBid
    currentStep.value = 1
    originBankId.value = null
    destinationAccountId.value = null
    sourceFundId.value = null
    voucherFileName.value = null
    completionSnapshot.value = null
    draftStarted.value = true
  }

  function setStep(step: 1 | 2 | 3) {
    currentStep.value = step
  }

  function setOriginBankId(id: string | null) {
    originBankId.value = id
  }

  function setDestinationAccountId(id: string | null) {
    destinationAccountId.value = id
  }

  function setSourceFundId(id: string | null) {
    sourceFundId.value = id
  }

  function setVoucherFileName(name: string | null) {
    voucherFileName.value = name
  }

  function setCompletionSnapshot(payload: TransactionCompletionSnapshot) {
    completionSnapshot.value = payload
  }

  function reset() {
    sendAmount.value = ''
    receiveAmount.value = ''
    couponCode.value = ''
    mode.value = 'compra'
    rateAsk.value = 0
    rateBid.value = 0
    currentStep.value = 1
    originBankId.value = null
    destinationAccountId.value = null
    sourceFundId.value = null
    voucherFileName.value = null
    completionSnapshot.value = null
    draftStarted.value = false
  }

  return {
    sendAmount,
    receiveAmount,
    couponCode,
    mode,
    rateAsk,
    rateBid,
    currentStep,
    originBankId,
    destinationAccountId,
    sourceFundId,
    voucherFileName,
    completionSnapshot,
    draftStarted,
    hasValidDraft,
    setFromHome,
    setStep,
    setOriginBankId,
    setDestinationAccountId,
    setSourceFundId,
    setVoucherFileName,
    setCompletionSnapshot,
    reset,
  }
})
