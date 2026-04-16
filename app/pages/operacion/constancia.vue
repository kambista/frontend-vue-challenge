<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
    <div class="w-full max-w-sm">

      <!-- Pig mascot -->
      <img
        src="/images/complete_data_operation/verificacion-completada.png"
        alt="Constancia enviada"
        class="w-28 h-28 object-contain block mx-auto mb-2"
        onerror="this.style.display='none'"
      />

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6 mb-4">

        <h1 class="text-xl font-bold text-[#1A1A2E] text-center mb-4">
          ¡Constancia enviada!
        </h1>
        <hr class="border-gray-100 mb-5" />

        <!-- Código Kambista -->
        <div class="mb-4">
          <p class="text-sm text-gray-500 mb-0.5">Código Kambista</p>
          <p class="text-lg font-bold text-[#1A1A2E] mb-1">{{ store.operationData.coupon }}</p>
          <p class="text-xs text-gray-400">*Usa tu código para dar seguimiento a tu operación.</p>
        </div>

        <!-- Monto a recibir -->
        <div class="mb-4">
          <p class="text-sm text-gray-500 mb-0.5">Monto a recibir</p>
          <p class="text-lg font-bold text-[#1A1A2E]">{{ montoRecibir }}</p>
        </div>

        <!-- Tiempo estimado -->
        <div>
          <p class="text-sm text-gray-500 mb-0.5">Tiempo estimado de espera</p>
          <p class="text-lg font-bold text-[#1A1A2E]">20h 15min</p>
        </div>
      </div>

      <!-- Promo banner -->
      <img
        src="/images/complete_data_operation/Frame 427319079.png"
        alt="Disfruta de descuentos en los mejores comercios"
        class="w-full rounded-2xl mb-5"
        onerror="this.style.display='none'"
      />

      <!-- Footer message -->
      <p class="text-sm text-gray-500 text-center mb-6 leading-relaxed px-2">
        Verificaremos tu operación. Puedes ver su estado en "Mis operaciones".
      </p>

      <!-- CTA -->
      <button
        type="button"
        class="w-full py-4 bg-[#00D4C8] text-white rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-[#00BFB4] active:scale-[0.98] transition-all duration-200"
        @click="handleGoHome"
      >
        VOLVER A INICIO
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import confetti from 'canvas-confetti'

definePageMeta({
  layout: false,
})

const store = useOperationStore()
const router = useRouter()

onMounted(() => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  })
})

const montoRecibir = computed(() => {
  const symbol = store.operationData.receiveCurrency === 'PEN' ? 'S/' : '$'
  return `${symbol} ${store.operationData.receiveAmount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
})

function handleGoHome() {
  store.resetOperation()
  router.push('/dashboard')
}
</script>
