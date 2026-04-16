<template>
  <!-- Overlay -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
        @click.self="$emit('update:modelValue', false)"
      >
        <!-- Modal / Bottom Sheet -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="translate-y-full sm:translate-y-0 sm:opacity-0 sm:scale-95"
          enter-to-class="translate-y-0 sm:opacity-100 sm:scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="translate-y-0 sm:opacity-100 sm:scale-100"
          leave-to-class="translate-y-full sm:translate-y-0 sm:opacity-0 sm:scale-95"
        >
          <div
            v-if="modelValue"
            class="w-full sm:max-w-md sm:mx-4 bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl"
            @click.stop
          >
            <!-- Handle bar (mobile only) -->
            <div class="flex justify-center pt-3 sm:hidden">
              <div class="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            <!-- Header -->
            <div class="px-6 py-4 flex items-start justify-between border-b border-gray-100">
              <div>
                <h2 class="text-[#1A1A2E] font-bold text-base leading-tight">
                  Selecciona tu cuenta destino
                </h2>
                <p class="text-gray-500 text-sm mt-0.5">Cuenta en <span class="font-semibold">{{ currency }}</span></p>
              </div>
              <button
                class="text-gray-400 hover:text-gray-700 transition-colors mt-0.5"
                @click="$emit('update:modelValue', false)"
                aria-label="Cerrar"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>

            <!-- Account list -->
            <div class="bg-white">
              <ul role="listbox">
                <li
                  v-for="account in accounts"
                  :key="account.alias"
                  class="px-6 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors duration-100 border-b border-gray-100 last:border-b-0"
                  role="option"
                  @click="selectAccount(account)"
                >
                  <p class="text-[#1A1A2E] font-semibold text-sm">{{ account.alias }}</p>
                  <p class="text-gray-400 text-xs mt-0.5">
                    <span v-if="account.bank" class="font-medium text-gray-500">{{ account.bank }} · </span>
                    <span class="font-mono tracking-wider">{{ account.number }}</span>
                  </p>
                </li>
              </ul>

              <!-- Add account -->
              <div class="px-6 py-4 border-t border-gray-100">
                <button
                  class="flex items-center gap-3 group"
                  @click="$emit('add-account')"
                >
                  <div class="w-9 h-9 border-2 border-gray-300 rounded-lg flex items-center justify-center group-hover:border-[#1A1A2E] transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="#6B7280" stroke-width="2" stroke-linecap="round" class="group-hover:stroke-[#1A1A2E] transition-colors"/>
                    </svg>
                  </div>
                  <span class="text-[#1A1A2E] font-medium text-sm group-hover:underline">Agregar cuenta</span>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
export interface BankAccount {
  alias: string
  number: string
  bank?: string
}

const props = defineProps<{
  modelValue: boolean
  currency: string
  accounts: BankAccount[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'select': [account: BankAccount]
  'add-account': []
}>()

function selectAccount(account: BankAccount) {
  emit('select', account)
  emit('update:modelValue', false)
}
</script>
