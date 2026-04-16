<template>
  <div class="flex-1 flex flex-col px-4 py-6">
    <div class="w-full max-w-lg mx-auto">

      <!-- Rate update countdown -->
      <p class="text-sm text-gray-500 mb-4">
        El tipo de cambio podría actualizarse a las:
        <strong class="text-[#1A1A2E] ml-1">{{ countdownTime }}</strong>
      </p>

      <!-- Transfer card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <!-- Illustration -->
        <img
          src="/images/complete_data_operation/wallet.png"
          alt=""
          class="w-20 h-20 object-contain block mx-auto mb-4"
          onerror="this.style.display='none'"
        />

        <!-- Instruction -->
        <p class="text-sm text-gray-600 text-center mb-5 leading-relaxed">
          Transfiere desde tu app bancaria y guarda el
          <span class="font-semibold underline text-[#1A1A2E]">número o código de operación</span>
          para el siguiente paso.
        </p>

        <!-- Bank details -->
        <div class="border border-gray-200 rounded-xl divide-y divide-gray-100">
          <div class="px-4 py-3">
            <TransferBankDetailRow label="Banco" :value="kambistaBankAccount?.bank ?? '—'" />
          </div>
          <div class="px-4 py-3">
            <TransferBankDetailRow label="Monto" :value="montoLabel" copyable />
          </div>
          <div class="px-4 py-3">
            <TransferBankDetailRow label="Número de cuenta" :value="kambistaBankAccount?.accountNumber ?? '—'" copyable />
          </div>
          <div class="px-4 py-3">
            <TransferBankDetailRow label="RUC" :value="kambistaBankAccount?.ruc ?? '—'" copyable />
          </div>
          <div class="px-4 py-3">
            <TransferBankDetailRow label="Titular de la cuenta" :value="kambistaBankAccount?.holder ?? '—'" bold />
          </div>
          <div class="px-4 py-3">
            <TransferBankDetailRow label="Tipo de cuenta" :value="kambistaBankAccount?.accountType ?? '—'" bold />
          </div>
        </div>
      </div>

      <!-- CTA -->
      <button
        type="button"
        class="w-full py-4 bg-[#00D4C8] text-white rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-[#00BFB4] active:scale-[0.98] transition-all duration-200"
        @click="$emit('transfer-done')"
      >
        YA HICE MI TRANSFERENCIA
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

defineEmits<{
  'transfer-done': []
}>()

const store = useOperationStore()
const op = computed(() => store.operationData)
const kambistaBankAccount = computed(() => store.selectedBankAccount)

const montoLabel = computed(() => {
  const symbol = op.value.sendCurrency === 'USD' ? '$' : 'S/'
  return `${symbol}${op.value.sendAmount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
})

// Countdown timer — counts down from a future time ~20 min ahead
function getInitialTime(): string {
  const future = new Date(Date.now() + 20 * 60 * 1000)
  return `${String(future.getHours()).padStart(2, '0')}:${String(future.getMinutes()).padStart(2, '0')}`
}

const countdownTime = ref(getInitialTime())
let timer: ReturnType<typeof setInterval>

function startCountdown() {
    const parts = countdownTime.value.split(':').map(Number)
  if (parts.length < 2 || parts.some(isNaN)) return

  const [h, m] = parts as [number, number]
  let total = h * 60 + m

  timer = setInterval(() => {
    total -= 1
    if (total < 0) {
      clearInterval(timer)
      return
    }
    const hrs = Math.floor(total / 60)
    const mins = total % 60
    countdownTime.value = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
  }, 60000)
}

onMounted(startCountdown)
onUnmounted(() => clearInterval(timer))
</script>
