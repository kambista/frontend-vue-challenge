<script setup lang="ts">
const props = defineProps<{
  sendLabel: string
  receiveLabel: string
  sendDisplay: string
  receiveDisplay: string
  couponCode: string
  rateBidDisplay: string
  rateAskDisplay: string
}>()

const showCoupon = computed(() => props.couponCode.trim().length > 0)
</script>

<template>
  <div class="rounded-lg border border-[#e2e6ef] bg-white p-4 shadow-sm sm:p-5">
    <dl class="space-y-3 text-[14px] text-[#1a253f] sm:text-[15px]">
      <div class="flex justify-between gap-4">
        <dt class="font-medium text-[#4b5568]">
          Tú envías
        </dt>
        <dd class="text-right font-semibold text-[#0a1325]">
          {{ sendLabel }} {{ sendDisplay }}
        </dd>
      </div>
      <div class="flex justify-between gap-4">
        <dt class="font-medium text-[#4b5568]">
          Tú recibes
        </dt>
        <dd class="text-right font-semibold text-[#0a1325]">
          {{ receiveLabel }} {{ receiveDisplay }}
        </dd>
      </div>
      <div v-if="showCoupon" class="flex justify-between gap-4">
        <dt class="font-medium text-[#4b5568]">
          Cupón aplicado
        </dt>
        <dd class="text-right font-semibold text-[#0a1325]">
          {{ couponCode }}
        </dd>
      </div>
    </dl>
    <div class="my-4 border-t border-[#eceef3]" />
    <div class="flex flex-wrap items-baseline justify-between gap-2 text-[14px] sm:text-[15px]">
      <span class="font-medium text-[#4b5568]">Tipo de cambio utilizado</span>
      <span class="text-right font-semibold">
        <span class="text-[#d9467a]">{{ rateBidDisplay }}</span>
        <span class="mx-1.5 text-[#9aa3b2]">|</span>
        <span class="text-[#0a1325]">{{ rateAskDisplay }}</span>
      </span>
    </div>
  </div>
</template>
