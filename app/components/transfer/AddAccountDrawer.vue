<template>
  <Teleport to="body">
    <!-- Overlay -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[60] bg-black/50"
        @click.self="close"
      />
    </Transition>

    <!-- Drawer panel -->
    <Transition
      :enter-active-class="'transition duration-300 ease-out'"
      :enter-from-class="isMobile ? 'translate-y-full' : 'translate-x-full'"
      :enter-to-class="isMobile ? 'translate-y-0' : 'translate-x-0'"
      :leave-active-class="'transition duration-200 ease-in'"
      :leave-from-class="isMobile ? 'translate-y-0' : 'translate-x-0'"
      :leave-to-class="isMobile ? 'translate-y-full' : 'translate-x-full'"
    >
      <div
        v-if="modelValue"
        :class="[
          'fixed z-[70] bg-white shadow-2xl flex flex-col',
          isMobile
            ? 'bottom-0 left-0 right-0 rounded-t-2xl max-h-[90vh]'
            : 'right-0 top-0 h-full w-full max-w-[480px]',
        ]"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <!-- Mobile handle -->
          <div class="absolute left-1/2 -translate-x-1/2 top-2 w-10 h-1 bg-gray-300 rounded-full sm:hidden" />
          <h2 class="text-lg font-bold text-[#1A1A2E]">
            Agregar cuenta
          </h2>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
            aria-label="Cerrar"
            @click="close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- Scrollable body -->
        <div class="flex-1 overflow-y-auto px-6 py-5">
          <!-- Notice -->
          <p class="text-sm text-gray-700 mb-6 leading-relaxed">
            La cuenta que registres <strong class="font-bold text-[#1A1A2E]">debe estar a tu nombre</strong>
            (titular de este perfil en Kambista)
          </p>

          <!-- Grid: Tipo de cuenta + Número de cuenta -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <!-- Tipo de cuenta -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Tipo de cuenta
              </label>
              <div class="relative">
                <select
                  v-model="form.accountType"
                  class="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00D4C8]/40 focus:border-[#00D4C8] transition-all cursor-pointer pr-10"
                >
                  <option value="" disabled>Selecciona</option>
                  <option value="ahorro">Cuenta de Ahorros</option>
                  <option value="corriente">Cuenta Corriente</option>
                  <option value="cci">CCI (Código de Cuenta Interbancario)</option>
                </select>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Número de cuenta -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Número de cuenta
              </label>
              <input
                v-model="form.accountNumber"
                type="text"
                inputmode="numeric"
                placeholder="Solo dígitos"
                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D4C8]/40 focus:border-[#00D4C8] transition-all"
                :class="accountNumberError ? 'border-red-400 focus:ring-red-300' : ''"
                @blur="accountNumberTouched = true"
              />
              <p v-if="accountNumberError" class="text-xs text-red-500 mt-1 px-1">{{ accountNumberError }}</p>
            </div>
          </div>

          <!-- Grid: Banco + Alias -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <!-- Banco -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Banco
              </label>
              <div class="relative">
                <select
                  v-model="form.bank"
                  class="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00D4C8]/40 focus:border-[#00D4C8] transition-all cursor-pointer pr-10"
                >
                  <option value="" disabled>Selecciona</option>
                  <option
                    v-for="bank in bankOptions"
                    :key="bank.id"
                    :value="bank.alias"
                  >
                    {{ bank.name }}
                  </option>
                </select>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Alias / nombre de cuenta -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Ponle nombre a tu cuenta
              </label>
              <input
                v-model="form.alias"
                type="text"
                placeholder="Escribe un alias"
                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D4C8]/40 focus:border-[#00D4C8] transition-all"
              />
            </div>
          </div>

          <!-- Info banner -->
          <div class="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6">
            <svg class="flex-shrink-0 mt-0.5 text-blue-500" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <p class="text-xs text-blue-700 leading-relaxed">
              Operamos en Lima con todos los bancos. Y en provincia con el BCP y cuentas digitales Interbank.
            </p>
          </div>

          <!-- Moneda -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
            <div class="flex gap-2">
              <button
                type="button"
                :class="[
                  'px-6 py-2 rounded-xl text-sm font-bold transition-all',
                  form.currency === 'soles'
                    ? 'bg-[#1A1A2E] text-white shadow'
                    : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'
                ]"
                @click="form.currency = 'soles'"
              >
                SOLES
              </button>
              <button
                type="button"
                :class="[
                  'px-6 py-2 rounded-xl text-sm font-bold transition-all',
                  form.currency === 'dolares'
                    ? 'bg-[#1A1A2E] text-white shadow'
                    : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'
                ]"
                @click="form.currency = 'dolares'"
              >
                DÓLARES
              </button>
            </div>
          </div>

          <!-- Declaración + Botón -->
          <div class="flex flex-col sm:flex-row sm:items-start gap-4">
            <!-- Checkbox disclaimer -->
            <div class="flex-1">
              <label class="flex items-start gap-3 cursor-pointer select-none">
                <div class="flex-shrink-0 mt-0.5">
                  <input
                    v-model="form.declaration"
                    type="checkbox"
                    class="w-4 h-4 rounded border-gray-300 text-[#00D4C8] accent-[#00D4C8] cursor-pointer"
                  />
                </div>
                <div>
                  <p class="text-sm font-semibold text-[#1A1A2E]">
                    Declaro que esta cuenta es mía y <span class="font-bold">NO</span> es de un tercero
                  </p>
                  <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    *Es obligatorio que la cuenta esté a tu nombre para que el cambio sea exitoso
                  </p>
                </div>
              </label>
            </div>

            <!-- Botón Agregar y Usar -->
            <button
              type="button"
              :disabled="!isFormValid"
              :class="[
                'flex-shrink-0 px-8 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-200',
                isFormValid
                  ? 'bg-[#00D4C8] text-white hover:bg-[#00BFB4] active:scale-[0.98] shadow-sm'
                  : 'bg-[#00D4C8]/50 text-white cursor-not-allowed'
              ]"
              @click="handleSubmit"
            >
              AGREGAR Y USAR
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted, onUnmounted } from 'vue'
import type { BankOption } from '~/types/operation'

const props = defineProps<{
  modelValue: boolean
  bankOptions?: BankOption[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'account-added': [account: { alias: string; number: string; bank: string }]
}>()

const isMobile = ref(false)

onMounted(() => {
  const check = () => { isMobile.value = window.innerWidth < 640 }
  check()
  window.addEventListener('resize', check)
  onUnmounted(() => window.removeEventListener('resize', check))
})

const form = reactive({
  accountType: '',
  accountNumber: '',
  bank: '',
  alias: '',
  currency: 'soles' as 'soles' | 'dolares',
  declaration: false,
})

// Validación número de cuenta: solo dígitos
const accountNumberTouched = ref(false)

const accountNumberError = computed(() => {
  if (!accountNumberTouched.value) return ''
  if (!form.accountNumber.trim()) return 'El número de cuenta es obligatorio.'
  if (!/^\d+$/.test(form.accountNumber)) return 'El número de cuenta debe contener solo dígitos.'
  return ''
})

const isFormValid = computed(() =>
  !!form.accountType &&
  !!form.accountNumber.trim() &&
  /^\d+$/.test(form.accountNumber) &&
  !!form.bank &&
  !!form.alias.trim() &&
  form.declaration
)

function close() {
  emit('update:modelValue', false)
}

function handleSubmit() {
  accountNumberTouched.value = true
  if (!isFormValid.value) return
  emit('account-added', {
    alias: form.alias,
    number: form.accountNumber,
    bank: form.bank,
  })
  close()
  // Reset form
  Object.assign(form, {
    accountType: '',
    accountNumber: '',
    bank: '',
    alias: '',
    currency: 'soles',
    declaration: false,
  })
  accountNumberTouched.value = false
}
</script>
