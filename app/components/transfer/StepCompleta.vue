<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-lg mx-auto">
      <!-- Title -->
      <h1 class="text-2xl font-bold text-[#1A1A2E] text-center mb-6">
        Completa los datos de tu operación
      </h1>

      <!-- Operation summary card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 mb-4">
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-gray-500 text-sm">Tú envías</span>
          <span class="font-bold text-[#1A1A2E]">
            {{ op.sendCurrency === 'USD' ? '$' : 'S/' }} {{ op.sendAmount.toFixed(2) }}
          </span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-gray-500 text-sm">Tú recibes</span>
          <span class="font-bold text-[#1A1A2E]">
            {{ op.receiveCurrency === 'PEN' ? 'S/' : '$' }} {{ op.receiveAmount.toFixed(2) }}
          </span>
        </div>
        <div v-if="op.coupon" class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-gray-500 text-sm">Cupón aplicado</span>
          <span class="font-bold text-[#1A1A2E]">{{ op.coupon }}</span>
        </div>
        <div class="flex justify-between items-center pt-2">
          <span class="font-semibold text-[#1A1A2E] text-sm">Tipo de cambio utilizado</span>
          <div class="flex items-center gap-2">
            <span v-if="op.previousRate && op.previousRate !== op.currentRate" class="text-red-500 line-through text-sm font-medium">{{ op.previousRate }}</span>
            <span class="font-bold text-[#1A1A2E]">{{ op.currentRate }}</span>
          </div>
        </div>
      </div>

      <!-- Wait time info banner -->
      <Transition name="fade">
        <div
          v-if="showTimeBanner"
          class="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6"
        >
          <svg class="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#3B82F6" stroke-width="2"/>
            <path d="M12 7v5l3 3" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p class="text-xs text-blue-700 leading-relaxed flex-1">
            Tiempo estimado de espera
            <strong>BCP, Interbank, BanBif y Pichincha</strong>:
            15 minutos (Aplica para cualquier monto). Otros bancos 1 día útil.
          </p>
          <button
            class="text-blue-400 hover:text-blue-600 flex-shrink-0"
            @click="showTimeBanner = false"
            aria-label="Cerrar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </Transition>

      <!-- Origin bank: ¿Desde qué banco nos envías tu dinero? -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-[#1A1A2E] mb-2">
          ¿Desde qué banco nos envías tu dinero?
        </label>
        <div class="relative" ref="originBankRef">
          <button
            type="button"
            class="w-full flex items-center justify-between px-4 py-3 bg-white border rounded-xl text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A2E]/20"
            :class="originBankOpen ? 'border-[#1A1A2E]' : 'border-gray-200 hover:border-gray-400'"
            @click="originBankOpen = !originBankOpen"
          >
            <span :class="originBank ? 'text-[#1A1A2E] font-medium' : 'text-gray-400'">
              {{ originBankLabel || 'Selecciona' }}
            </span>
            <svg class="w-4 h-4 text-gray-500 transition-transform" :class="{ 'rotate-180': originBankOpen }" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
          >
            <ul
              v-if="originBankOpen"
              class="hidden sm:block absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto"
              role="listbox"
            >
              <li
                v-for="bank in bankOptions"
                :key="bank.id"
                class="px-4 py-3 cursor-pointer text-sm transition-colors first:rounded-t-xl last:rounded-b-xl"
                :class="originBank === bank.alias ? 'bg-gray-50 font-medium text-[#1A1A2E]' : 'text-gray-700 hover:bg-gray-50'"
                role="option"
                @click="selectOriginBank(bank)"
              >
                {{ bank.name }}
              </li>
            </ul>
          </Transition>
        </div>

        <!-- Mobile bottom sheet: banco origen -->
        <Teleport to="body">
          <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="originBankOpen" class="sm:hidden fixed inset-0 z-[60] bg-black/50" @click="originBankOpen = false" />
          </Transition>
          <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="translate-y-full" enter-to-class="translate-y-0" leave-active-class="transition duration-200 ease-in" leave-from-class="translate-y-0" leave-to-class="translate-y-full">
            <div v-if="originBankOpen" class="sm:hidden fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-2xl max-h-[75vh] flex flex-col">
              <div class="flex justify-center pt-3 pb-0.5"><div class="w-10 h-1 bg-gray-300 rounded-full" /></div>
              <div class="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <p class="text-sm font-bold text-[#1A1A2E]">¿Desde qué banco nos envías tu dinero?</p>
                <button class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400" @click="originBankOpen = false">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                </button>
              </div>
              <ul class="overflow-y-auto flex-1 divide-y divide-gray-100" role="listbox">
                <li
                  v-for="bank in bankOptions"
                  :key="bank.id"
                  class="px-5 py-4 text-sm text-gray-800 active:bg-gray-50 cursor-pointer"
                  :class="originBank === bank.alias ? 'font-semibold text-[#1A1A2E]' : ''"
                  role="option"
                  @click="selectOriginBank(bank)"
                >
                  {{ bank.name }}
                </li>
              </ul>
            </div>
          </Transition>
        </Teleport>
      </div>

      <!-- Destination account: ¿En qué cuenta deseas recibir tu dinero? -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-[#1A1A2E] mb-2">
          ¿En qué cuenta deseas recibir tu dinero?
        </label>
        <button
          type="button"
          class="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-left transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A1A2E]/20"
          @click="showAccountModal = true"
        >
          <span :class="selectedAccount ? 'text-[#1A1A2E] font-medium' : 'text-gray-400'">
            {{ selectedAccount?.alias || 'Selecciona' }}
          </span>
          <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Third party warning -->
      <Transition name="fade">
        <div
          v-if="showAccountWarning && selectedAccount"
          class="flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mb-4"
        >
          <svg class="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p class="text-xs text-orange-700 leading-relaxed flex-1">
            Recuerda que las cuentas deben <strong>estar a tu nombre.</strong>
            Kambista <strong>no transfiere a cuentas de terceros.</strong>
          </p>
          <button
            class="text-orange-400 hover:text-orange-600 flex-shrink-0"
            @click="showAccountWarning = false"
            aria-label="Cerrar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </Transition>

      <!-- Fund origin: Origen de fondos -->
      <div class="mb-8">
        <label class="block text-sm font-medium text-[#1A1A2E] mb-2">
          Origen de fondos
        </label>
        <div class="relative" ref="fundOriginRef">
          <button
            type="button"
            class="w-full flex items-center justify-between px-4 py-3 bg-white border rounded-xl text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A2E]/20"
            :class="fundOriginOpen ? 'border-[#1A1A2E]' : 'border-gray-200 hover:border-gray-400'"
            @click="fundOriginOpen = !fundOriginOpen"
          >
            <span :class="fundOrigin ? 'text-[#1A1A2E] font-medium' : 'text-gray-400'">
              {{ fundOrigin || 'Selecciona' }}
            </span>
            <svg class="w-4 h-4 text-gray-500 transition-transform" :class="{ 'rotate-180': fundOriginOpen }" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
          >
            <ul
              v-if="fundOriginOpen"
              class="hidden sm:block absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
              role="listbox"
            >
              <li
                v-for="source in fundOptions"
                :key="source._id"
                class="px-4 py-3 cursor-pointer text-sm transition-colors first:rounded-t-xl last:rounded-b-xl"
                :class="fundOrigin === source.name ? 'bg-gray-50 font-medium text-[#1A1A2E]' : 'text-gray-700 hover:bg-gray-50'"
                role="option"
                @click="selectFundOrigin(source)"
              >
                {{ source.name }}
              </li>
            </ul>
          </Transition>
        </div>

        <!-- Mobile bottom sheet: origen de fondos -->
        <Teleport to="body">
          <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="fundOriginOpen" class="sm:hidden fixed inset-0 z-[60] bg-black/50" @click="fundOriginOpen = false" />
          </Transition>
          <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="translate-y-full" enter-to-class="translate-y-0" leave-active-class="transition duration-200 ease-in" leave-from-class="translate-y-0" leave-to-class="translate-y-full">
            <div v-if="fundOriginOpen" class="sm:hidden fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-2xl max-h-[60vh] flex flex-col">
              <div class="flex justify-center pt-3 pb-0.5"><div class="w-10 h-1 bg-gray-300 rounded-full" /></div>
              <div class="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <p class="text-sm font-bold text-[#1A1A2E]">Origen de fondos</p>
                <button class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400" @click="fundOriginOpen = false">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                </button>
              </div>
              <ul class="overflow-y-auto flex-1 divide-y divide-gray-100" role="listbox">
                <li
                  v-for="source in fundOptions"
                  :key="source._id"
                  class="px-5 py-4 text-sm text-gray-800 active:bg-gray-50 cursor-pointer"
                  :class="fundOrigin === source.name ? 'font-semibold text-[#1A1A2E]' : ''"
                  role="option"
                  @click="selectFundOrigin(source)"
                >
                  {{ source.name }}
                </li>
              </ul>
            </div>
          </Transition>
        </Teleport>
      </div>

      <!-- Continue button -->
      <button
        type="button"
        class="w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200"
        :class="isFormValid
          ? 'bg-[#00D4C8] text-white hover:bg-[#00BFB4] active:scale-[0.98]'
          : 'bg-[#00D4C8]/60 text-white cursor-not-allowed'"
        :disabled="!isFormValid"
        @click="handleContinue"
      >
        Continuar
      </button>
    </div>

    <!-- Account selector modal -->
    <TransferAccountModal
      v-model="showAccountModal"
      currency="Soles"
      :accounts="savedAccounts"
      @select="handleAccountSelect"
      @add-account="handleAddAccount"
    />

    <!-- Add account drawer -->
    <TransferAddAccountDrawer
      v-model="showAddAccountDrawer"
      :bank-options="bankOptions"
      @account-added="handleNewAccount"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { BankAccount } from './AccountModal.vue'
import type { BankName, FundSource, BankOption, FundSourceOption } from '~/types/operation'
import { useMocks } from '~/composables/useMocks'

const emit = defineEmits<{
  continue: []
}>()

const store = useOperationStore()
const op = computed(() => store.operationData)

// Parsed mock data via composable
const { bankOptions, fundOptions } = useMocks()


// UI state
const showTimeBanner = ref(true)
const showAccountWarning = ref(true)
const showAccountModal = ref(false)
const showAddAccountDrawer = ref(false)

// Bank dropdown state
const originBankOpen = ref(false)
const fundOriginOpen = ref(false)
const originBankRef = ref<HTMLElement | null>(null)
const fundOriginRef = ref<HTMLElement | null>(null)

// Form state
const originBank = ref<string>(store.operationData.fromBank ?? '')
const originBankLabel = ref<string>('')
const selectedAccount = ref<BankAccount | null>(null)
const fundOrigin = ref<string>(store.operationData.fundSource ?? '')

// Pre-fill originBankLabel if already set
if (originBank.value) {
  const found = bankOptions.find((b: BankOption) => b.alias === originBank.value)
  if (found) originBankLabel.value = found.name
}

const isFormValid = computed(() =>
  !!originBank.value && !!selectedAccount.value && !!fundOrigin.value
)

// ── Bank / fund selection ────────────────────────────────────────────────────
function selectOriginBank(bank: BankOption) {
  originBank.value = bank.alias
  originBankLabel.value = bank.name
  originBankOpen.value = false
}

function selectFundOrigin(source: FundSourceOption) {
  fundOrigin.value = source.name
  fundOriginOpen.value = false
}

// Close dropdowns on outside click
function handleOutsideClick(e: MouseEvent) {
  if (originBankRef.value && !originBankRef.value.contains(e.target as Node)) {
    originBankOpen.value = false
  }
  if (fundOriginRef.value && !fundOriginRef.value.contains(e.target as Node)) {
    fundOriginOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => document.removeEventListener('mousedown', handleOutsideClick))

// ── Account handling ─────────────────────────────────────────────────────────
function handleAccountSelect(account: BankAccount) {
  selectedAccount.value = account
  showAccountWarning.value = true
}

function handleAddAccount() {
  showAccountModal.value = false
  showAddAccountDrawer.value = true
}

function handleNewAccount(account: { alias: string; number: string; bank: string }) {
  const newAccount: BankAccount = { alias: account.alias, number: account.number, bank: account.bank }
  // Guardar en localStorage si es en soles
  store.saveAccountToLocalStorage(newAccount)
  savedAccounts.value.unshift(newAccount)
  selectedAccount.value = newAccount
  showAccountWarning.value = true
}

const savedAccounts = ref<BankAccount[]>([
  { alias: 'Cuenta de ahorros soles', number: '19123456789012', bank: 'BCP' },
  { alias: 'Cuenta corriente soles', number: '20045678901234', bank: 'Interbank' },
  { alias: 'Mi cuenta BBVA', number: '00110175012345', bank: 'BBVA' },
])

// Cargar cuentas guardadas del localStorage al inicializar
onMounted(() => {
  const savedFromStorage = store.getSavedAccountsFromLocalStorage()
  if (savedFromStorage.length > 0) {
    // Combinar cuentas por defecto con las guardadas
    savedAccounts.value = [...savedFromStorage, ...savedAccounts.value]
  }
})

// ── Continue ─────────────────────────────────────────────────────────────────
function handleContinue() {
  if (!isFormValid.value) return
  store.updateOperation({
    fromBank: originBank.value as BankName,
    toBank: selectedAccount.value?.alias ?? null,
    fundSource: fundOrigin.value as FundSource,
  })
  emit('continue')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
