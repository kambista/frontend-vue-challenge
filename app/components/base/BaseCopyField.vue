<template>
  <div class="inline-flex items-center gap-1.5">
    <span class="text-sm font-semibold text-gray-900">{{ value }}</span>
    <button
      class="bg-transparent border-none cursor-pointer p-1 rounded text-gray-400 hover:text-gray-700 transition-colors flex items-center"
      @click="handleCopy"
      :title="'Copiar ' + (label ?? value)"
      type="button"
    >
      <Transition name="fade" mode="out-in">
        <svg v-if="copied" key="check" :class="'text-[#4EC9C0]'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <svg v-else key="copy" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      </Transition>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: string
  label?: string
}>()

const { copyToClipboard, copiedKey } = useClipboard()
const copied = computed(() => copiedKey.value === props.value)

function handleCopy() {
  copyToClipboard(props.value, props.value)
}
</script>
