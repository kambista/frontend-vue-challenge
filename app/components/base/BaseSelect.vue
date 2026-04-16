<template>
  <div class="relative mb-4" ref="selectRef">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1.5">{{ label }}</label>
    <div
      :class="[
        'flex items-center justify-between px-4 py-3 bg-white border rounded-lg cursor-pointer text-base text-gray-800 transition-all select-none',
        isOpen ? 'border-[#4EC9C0] ring-2 ring-[#4EC9C0]/20' : 'border-gray-200 hover:border-gray-400',
      ]"
      @click="toggleOpen"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-label="label"
    >
      <span :class="!modelValue && 'text-gray-400'">
        {{ modelValue || placeholder }}
      </span>
      <svg
        :class="['flex-shrink-0 text-gray-400 transition-transform duration-200', isOpen && 'rotate-180']"
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>

    <Transition
      enter-active-class="transition-all duration-150"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-100"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <ul
        v-if="isOpen"
        class="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 list-none m-0 p-1 max-h-56 overflow-y-auto"
        role="listbox"
      >
        <li
          v-for="option in options"
          :key="option"
          :class="[
            'px-4 py-2.5 cursor-pointer text-sm text-gray-800 rounded-md transition-colors',
            option === modelValue ? 'bg-[#e6faf8] font-semibold text-[#111760]' : 'hover:bg-gray-50'
          ]"
          @click="selectOption(option)"
          role="option"
          :aria-selected="option === modelValue"
        >
          {{ option }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const props = defineProps<{
  modelValue: string
  options: string[]
  placeholder?: string
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const selectRef = ref<HTMLElement | null>(null)

onClickOutside(selectRef, () => {
  isOpen.value = false
})

function toggleOpen() {
  isOpen.value = !isOpen.value
}

function selectOption(option: string) {
  emit('update:modelValue', option)
  isOpen.value = false
}
</script>
