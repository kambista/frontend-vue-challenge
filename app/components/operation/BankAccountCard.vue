<template>
  <div class="bg-white rounded-xl shadow-card p-6 mb-4">
    <!-- Illustration -->
    <img
      src="/images/realiza-la-transferencia 4.png"
      alt="Realiza la transferencia"
      class="w-16 h-16 object-contain block mx-auto mb-3"
    />

    <!-- Title -->
    <h2 v-if="title" class="text-xl font-bold text-[#111760] text-center mb-2">{{ title }}</h2>

    <!-- Instructions slot -->
    <div v-if="$slots.subtitle" class="text-sm text-gray-700 text-center mb-4 leading-relaxed space-y-1">
      <slot name="subtitle" />
    </div>

    <!-- Account details table -->
    <dl class="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100">
      <div class="flex justify-between items-center px-4 py-3 text-sm">
        <dt class="text-gray-500 font-normal">Banco</dt>
        <dd class="font-semibold text-gray-900 m-0 text-right">{{ account.bank }}</dd>
      </div>
      <div v-if="receiveAmount" class="flex justify-between items-center px-4 py-3 text-sm">
        <dt class="text-gray-500 font-normal">Monto</dt>
        <dd class="font-semibold text-gray-900 m-0"><BaseCopyField :value="formattedMonto" label="Monto" /></dd>
      </div>
      <div class="flex justify-between items-center px-4 py-3 text-sm">
        <dt class="text-gray-500 font-normal">Número de cuenta</dt>
        <dd class="font-semibold text-gray-900 m-0"><BaseCopyField :value="account.accountNumber" label="Número de cuenta" /></dd>
      </div>
      <div class="flex justify-between items-center px-4 py-3 text-sm">
        <dt class="text-gray-500 font-normal">RUC</dt>
        <dd class="font-semibold text-gray-900 m-0"><BaseCopyField :value="account.ruc" label="RUC" /></dd>
      </div>
      <div class="flex justify-between items-center px-4 py-3 text-sm">
        <dt class="text-gray-500 font-normal">Titular de la cuenta</dt>
        <dd class="font-semibold text-gray-900 m-0 text-right">{{ account.holder }}</dd>
      </div>
      <div class="flex justify-between items-center px-4 py-3 text-sm">
        <dt class="text-gray-500 font-normal">Tipo de Cuenta</dt>
        <dd class="font-semibold text-gray-900 m-0 text-right">{{ account.accountType }}</dd>
      </div>
    </dl>

    <!-- Disclaimer -->
    <p v-if="disclaimer" class="text-xs text-gray-500 mt-3 leading-relaxed font-medium">{{ disclaimer }}</p>
  </div>
</template>

<script setup lang="ts">
import type { KambistaBankAccount, Currency } from '~/types/operation'
import { formatCurrency } from '~/utils/formatters'

const props = defineProps<{
  account: KambistaBankAccount
  title?: string
  disclaimer?: string
  receiveAmount?: number
  receiveCurrency?: Currency
}>()

const formattedMonto = computed(() => {
  if (!props.receiveAmount) return ''
  return formatCurrency(props.receiveAmount, props.receiveCurrency ?? 'PEN')
})
</script>
