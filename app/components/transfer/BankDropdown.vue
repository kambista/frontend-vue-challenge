<template>
  <div class="relative" ref="containerRef">
    <!-- Trigger -->
    <button
      type="button"
      class="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-left transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A1A2E]/20"
      :class="{ 'border-[#1A1A2E]': isOpen }"
      @click="toggleOpen"
      :aria-expanded="isOpen"
    >
      <span :class="selected ? 'text-[#1A1A2E] font-medium' : 'text-gray-400'">
        {{ selected || placeholder }}
      </span>
      <svg
        class="w-4 h-4 text-gray-500 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Dropdown list -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <ul
        v-if="isOpen"
        class="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
        role="listbox"
      >
        <li
          v-for="option in options"
          :key="option"
          class="px-4 py-3 cursor-pointer text-[#1A1A2E] hover:bg-gray-50 transition-colors duration-100 first:rounded-t-xl last:rounded-b-xl"
          :class="{ 'bg-gray-50 font-medium': option === selected }"
          role="option"
          :aria-selected="option === selected"
          @click="selectOption(option)"
        >
          {{ option }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  options: string[]
  placeholder?: string
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const selected = ref(props.modelValue || '')
const containerRef = ref<HTMLElement | null>(null)

watch(() => props.modelValue, (val) => {
  if (val !== undefined) selected.value = val
})

function toggleOpen() {
  isOpen.value = !isOpen.value
}

function selectOption(option: string) {
  selected.value = option
  emit('update:modelValue', option)
  isOpen.value = false
}

// Close on outside click
function handleClickOutside(event: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))
</script>
