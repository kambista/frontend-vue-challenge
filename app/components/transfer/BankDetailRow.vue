<template>
  <div class="flex justify-between items-start gap-4">
    <span class="text-gray-400 text-sm flex-shrink-0">{{ label }}</span>
    <div class="flex items-center gap-2">
      <span
        class="text-sm text-right"
        :class="bold ? 'font-bold text-[#1A1A2E]' : 'text-[#1A1A2E]'"
      >
        {{ value }}
      </span>
      <button
        v-if="copyable"
        class="text-gray-400 hover:text-[#1A1A2E] transition-colors relative"
        :aria-label="`Copiar ${label}`"
        @click="handleCopy"
      >
        <!-- Copy icon -->
        <svg v-if="!copied" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="2"/>
        </svg>
        <!-- Check icon -->
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-green-500">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  label: string
  value: string
  copyable?: boolean
  bold?: boolean
}>()

const copied = ref(false)

async function handleCopy() {
  if (!props.copyable) return
  try {
    await navigator.clipboard.writeText(props.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback for older browsers
    const el = document.createElement('textarea')
    el.value = props.value
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>
