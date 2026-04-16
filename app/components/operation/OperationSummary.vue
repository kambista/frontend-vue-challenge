<template>
  <div class="bg-white rounded-xl shadow-card p-5 mb-4">
    <div class="flex justify-between items-center py-2 text-sm text-gray-800">
      <span>Tú envías</span>
      <strong class="font-bold">{{ formatCurrency(data.sendAmount, data.sendCurrency) }}</strong>
    </div>
    <div class="flex justify-between items-center py-2 text-sm text-gray-800">
      <span>Tú recibes</span>
      <strong class="font-bold">{{ formatCurrency(data.receiveAmount, data.receiveCurrency) }}</strong>
    </div>
    <div v-if="data.coupon" class="flex justify-between items-center py-2 text-sm text-gray-800">
      <span>Cupón aplicado</span>
      <strong class="font-bold">{{ data.coupon }}</strong>
    </div>
    <div class="flex justify-between items-center py-3 text-sm text-gray-800 border-t border-gray-100 mt-1 font-medium">
      <span>Tipo de cambio utilizado</span>
      <RateDisplay :current="data.currentRate" :previous="data.previousRate" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OperationData } from '~/types/operation'
import { formatCurrency } from '~/utils/formatters'

defineProps<{ data: OperationData }>()
</script>
