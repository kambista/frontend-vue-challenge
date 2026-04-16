<template>
  <main class="flex-1 flex flex-col items-center px-4 py-8">
      <div class="w-full max-w-lg">
        <h1 class="text-2xl font-bold text-[#111760] text-center mb-6">
          Completa los datos de tu operacion
        </h1>

        <OperationSummary :data="store.operationData" />

        <BaseBanner type="info" :dismissible="true">
          Tiempo estimado de espera
          <strong>BCP, Interbank, BanBif y Pichincha</strong>:
          15 minutos (Aplica para cualquier monto). Otros bancos 1 dia util.
        </BaseBanner>

        <form class="flex flex-col gap-0" @submit.prevent="handleContinue" novalidate>
          <BaseSelect
            v-model="fromBank"
            label="Desde que banco nos envias tu dinero?"
            :options="BANKS"
            placeholder="Selecciona"
          />

          <BaseSelect
            v-model="toBank"
            label="En que cuenta deseas recibir tu dinero?"
            :options="BANKS"
            placeholder="Selecciona"
          />

          <BaseBanner v-if="toBank" type="warning" :dismissible="true">
            Recuerda que las cuentas deben
            <strong>estar a tu nombre.</strong>
            Kambista <strong>no transfiere a cuentas de terceros.</strong>
          </BaseBanner>

          <BaseSelect
            v-model="fundSource"
            label="Origen de fondos"
            :options="FUND_SOURCES"
            placeholder="Selecciona"
          />

          <BaseButton
            variant="primary"
            :block="true"
            type="submit"
            :disabled="!isFormValid"
          >
            CONTINUAR
          </BaseButton>
        </form>
      </div>
  </main>
</template>

<script setup lang="ts">
import type { BankName, FundSource } from "~/types/operation"

definePageMeta({
  layout: 'operation',
  middleware: "operation-guard",
})

const store = useOperationStore()
const { goToStep } = useOperationFlow()

const BANKS: BankName[] = [
  "BCP",
  "Interbank",
  "Scotiabank",
  "BBVA Continental",
  "Banco Falabella",
  "BanBif",
  "Pichincha",
]

const FUND_SOURCES: FundSource[] = [
  "Ahorros",
  "Herencia",
  "Venta de inmuebles",
  "Otros",
  "Pasaporte",
]

const fromBank = ref<BankName | "">(store.operationData.fromBank ?? "")
const toBank = ref<BankName | "">(store.operationData.toBank ?? "")
const fundSource = ref<FundSource | "">(store.operationData.fundSource ?? "")

const isFormValid = computed(
  () => !!fromBank.value && !!toBank.value && !!fundSource.value,
)

function handleContinue() {
  if (!isFormValid.value) return
  store.updateOperation({
    fromBank: fromBank.value as BankName,
    toBank: toBank.value as BankName,
    fundSource: fundSource.value as FundSource,
  })
  goToStep(2)
}
</script>
