<script setup lang="ts">
import { TRANSACTION_CONSTANCIA_ILLUSTRATION_SRC } from '~/constants/kambistaDeposit'

useHead({
  title: 'Envía constancia - Kambista',
})

definePageMeta({
  middleware: 'auth',
})

const MAX_BYTES = 10 * 1024 * 1024
const ALLOWED_MIME = new Set(['application/pdf', 'image/jpeg', 'image/png'])

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

tx.setStep(3)

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const fileError = ref('')

function extensionOf(name: string) {
  const i = name.lastIndexOf('.')
  return i >= 0 ? name.slice(i).toLowerCase() : ''
}

function isAllowedFile(file: File) {
  const ext = extensionOf(file.name)
  if (!['.pdf', '.jpg', '.jpeg', '.png'].includes(ext))
    return false
  if (file.type && !ALLOWED_MIME.has(file.type))
    return false
  return true
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  fileError.value = ''

  if (!file) {
    selectedFile.value = null
    tx.setVoucherFileName(null)
    return
  }

  if (file.size > MAX_BYTES) {
    fileError.value = 'El archivo supera los 10 Mb.'
    input.value = ''
    selectedFile.value = null
    tx.setVoucherFileName(null)
    return
  }

  if (!isAllowedFile(file)) {
    fileError.value = 'Solo se permiten archivos PDF, JPG o PNG.'
    input.value = ''
    selectedFile.value = null
    tx.setVoucherFileName(null)
    return
  }

  selectedFile.value = file
  tx.setVoucherFileName(file.name)
}

function openFilePicker() {
  fileInputRef.value?.click()
}

const displayFileLabel = computed(() => {
  return selectedFile.value?.name ?? tx.voucherFileName ?? ''
})

function formatMoneyDisplay(raw: string) {
  const s = String(raw).trim().replace(/\s/g, '').replace(',', '.')
  const n = Number(s)
  if (!Number.isFinite(n))
    return '0.00'
  return n.toFixed(2)
}

function buildReceiveDisplay() {
  const n = formatMoneyDisplay(tx.receiveAmount)
  return tx.mode === 'compra' ? `S/ ${n}` : `$ ${n}`
}

function randomKambistaCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let s = ''
  for (let i = 0; i < 8; i++)
    s += chars.charAt(Math.floor(Math.random() * chars.length))
  return `km${s}`
}

async function onSubmit() {
  fileError.value = ''
  if (!selectedFile.value) {
    fileError.value = 'Selecciona un archivo de constancia.'
    return
  }
  tx.setCompletionSnapshot({
    kambistaCode: randomKambistaCode(),
    receiveDisplay: buildReceiveDisplay(),
    waitLabel: '20h 15min',
  })
  await navigateTo('/transaction/constancia-enviada')
}
</script>

<template>
  <TransactionFlowShell :current-step="3">
    <div
      class="rounded-2xl border border-[#e6e8ee] bg-white px-6 py-8 shadow-[0_4px_28px_rgba(15,23,42,0.07)] sm:px-8 sm:py-10"
    >
      <div class="mb-6 flex justify-center">
        <img
          :src="'/images/logo_constancia.png'"
          alt=""
          class="h-[120px] w-auto max-w-full object-contain sm:h-[140px]"
          width="200"
          height="140"
        >
      </div>

      <h1 class="mb-2.5 text-center text-[20px] font-bold leading-snug text-[#0a1325] sm:text-[22px]">
        Envía tu constancia
      </h1>
      <p class="mb-8 text-center text-[14px] leading-relaxed text-[#6b7280] sm:mb-10">
        Adjunta la constancia de tu transferencia para poder verificar tu operación.
      </p>

      <div class="rounded-xl border border-[#e2e6ed] bg-[#fafbfc] p-5 sm:p-6">
        <label class="mb-3 block text-[13px] font-medium text-[#6b7280] sm:text-[14px]">
          Sube el archivo de tu constancia
        </label>

        <input
          ref="fileInputRef"
          type="file"
          class="sr-only"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          @change="onFileChange"
        >

        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-lg border border-[#dfe4ec] bg-white px-3.5 py-3 text-left transition hover:border-[#cfd6e4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#42e3b4]/40"
          @click="openFilePicker"
        >
          <span
            class="min-w-0 flex-1 truncate text-[14px]"
            :class="displayFileLabel ? 'font-medium text-[#0a1325]' : 'text-[#9ca3af]'"
          >
            {{ displayFileLabel || 'Selecciona archivo' }}
          </span>
          <span class="shrink-0 text-[#6b7280]" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5" />
              <circle cx="9" cy="9" r="2" fill="currentColor" />
              <path d="M21 15l-5-5-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="17.5" cy="6.5" r="3" fill="#42e3b4" />
              <path d="M17.5 5.2v2.6M16.2 6.5h2.6" stroke="#07122c" stroke-width="1.2" stroke-linecap="round" />
            </svg>
          </span>
        </button>

        <p class="mt-3 text-[12px] text-[#9ca3af]">
          *Tamaño máximo permitido del archivo 10 Mb
        </p>
        <p v-if="fileError" class="mt-2 text-[13px] text-red-600">
          {{ fileError }}
        </p>
      </div>

      <div class="mt-8 sm:mt-9">
        <p class="mb-3 text-[14px] font-bold text-[#374151]">
          Recuerda:
        </p>
        <ul class="list-disc space-y-2.5 pl-5 text-[13px] leading-relaxed text-[#6b7280] sm:text-[14px]">
          <li>
            El voucher enviado debe tener el <span class="font-semibold text-[#374151]">monto, datos, del beneficiario, fecha y hora.</span>
          </li>
          <li>El voucher debe ser legible</li>
          <li>
            Archivos permitidos <span class="font-semibold text-[#374151]">PDF, JPG y PNG</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="mt-6 w-full sm:mt-7">
      <button
        type="button"
        class="w-full rounded-xl bg-[#42e3b4] py-4 text-center text-[15px] font-semibold uppercase tracking-wide text-[#07122c] transition hover:bg-[#36d4a8]"
        @click="onSubmit"
      >
        Enviar constancia
      </button>
    </div>
  </TransactionFlowShell>
</template>
