<script setup lang="ts">
import type { BankItem, UserCuenta } from '~/composables/useKambistaApi'
import { getApiErrorMessage } from '~/composables/useAuthApi'

const props = defineProps<{
  open: boolean
  userId: number
  banks: BankItem[]
  defaultMoneda: 'PEN' | 'USD'
}>()

const emit = defineEmits<{
  close: []
  created: [account: UserCuenta]
}>()

const { createUserAccount } = useKambistaApi()
const { validateBankAccountNumber, validateAccountAlias } = useValidation()

const tipoCuenta = ref('')
const entidadId = ref('')
const numeroCuenta = ref('')
const moneda = ref<'PEN' | 'USD'>('PEN')
const alias = ref('')
const esPropietario = ref(true)

const fieldErrors = ref<Record<string, string | null>>({})
const submitError = ref<string | null>(null)
const submitting = ref(false)

watch(
  () => props.open,
  (v) => {
    if (v) {
      tipoCuenta.value = ''
      entidadId.value = ''
      numeroCuenta.value = ''
      moneda.value = props.defaultMoneda
      alias.value = ''
      esPropietario.value = true
      fieldErrors.value = {}
      submitError.value = null
    }
  },
)

watch(
  () => props.defaultMoneda,
  (m) => {
    if (props.open)
      moneda.value = m
  },
)

const tipoOptions = [
  { value: 'AHORROS', label: 'Ahorros' },
  { value: 'CORRIENTE', label: 'Corriente' },
]

function validateForm(): boolean {
  fieldErrors.value = {}
  let ok = true
  if (!tipoCuenta.value) {
    fieldErrors.value.tipoCuenta = 'Selecciona el tipo de cuenta'
    ok = false
  }
  if (!entidadId.value) {
    fieldErrors.value.entidadId = 'Selecciona el banco'
    ok = false
  }
  const nErr = validateBankAccountNumber(numeroCuenta.value)
  if (nErr) {
    fieldErrors.value.numeroCuenta = nErr
    ok = false
  }
  const aErr = validateAccountAlias(alias.value)
  if (aErr) {
    fieldErrors.value.alias = aErr
    ok = false
  }
  if (!esPropietario.value) {
    fieldErrors.value.esPropietario = 'Debes confirmar que la cuenta es tuya'
    ok = false
  }
  return ok
}

async function onSubmit() {
  submitError.value = null
  if (!validateForm())
    return
  submitting.value = true
  try {
    const account = await createUserAccount({
      userId: props.userId,
      entidadId: Number(entidadId.value),
      tipoCuenta: tipoCuenta.value,
      numeroCuenta: numeroCuenta.value.trim().replace(/\s/g, ''),
      moneda: moneda.value,
      alias: alias.value.trim(),
      esPropietario: esPropietario.value,
    })
    emit('created', account)
    emit('close')
  }
  catch (e) {
    submitError.value = getApiErrorMessage(e)
  }
  finally {
    submitting.value = false
  }
}

const selectClass =
  'w-full appearance-none rounded-lg border border-[#dfe4ec] bg-white px-3 py-2.5 text-[14px] text-[#0a1325] outline-none focus:border-[#95e8df] focus:ring-2 focus:ring-[#95e8df]/40'
const inputClass =
  'w-full rounded-lg border border-[#dfe4ec] bg-white px-3 py-2.5 text-[14px] text-[#0a1325] outline-none focus:border-[#95e8df] focus:ring-2 focus:ring-[#95e8df]/40'
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/50 p-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-account-title"
    >
      <div class="absolute inset-0" aria-hidden="true" @click="emit('close')" />
      <div
        class="relative z-10 my-auto w-full max-w-3xl rounded-xl bg-white shadow-xl"
      >
        <header class="flex items-start justify-between gap-3 border-b border-[#eceef3] px-4 py-4 sm:px-6">
          <div class="min-w-0">
            <h2 id="add-account-title" class="text-lg font-bold text-[#0a1325]">
              Agregar cuenta — {{ moneda === 'PEN' ? 'Soles' : 'Dólares' }}
            </h2>
            <p class="mt-1 text-[13px] leading-snug text-[#5c6578]">
              La cuenta que registres <strong class="font-semibold text-[#0a1325]">debe estar a tu nombre</strong> (titular de este perfil en Kambista).
            </p>
          </div>
          <button
            type="button"
            class="shrink-0 rounded p-1 text-2xl leading-none text-[#6b7280] hover:bg-slate-100"
            aria-label="Cerrar"
            @click="emit('close')"
          >
            ×
          </button>
        </header>

        <div class="px-4 py-4 sm:px-6 sm:py-5">
          <p v-if="submitError" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-800">
            {{ submitError }}
          </p>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <div class="space-y-4">
              <div>
                <label class="mb-1.5 block text-[13px] font-medium text-[#1a253f]">Tipo de cuenta</label>
                <div class="relative">
                  <select v-model="tipoCuenta" :class="selectClass">
                    <option value="" disabled>
                      Selecciona
                    </option>
                    <option v-for="o in tipoOptions" :key="o.value" :value="o.value">
                      {{ o.label }}
                    </option>
                  </select>
                </div>
                <p v-if="fieldErrors.tipoCuenta" class="mt-1 text-[12px] text-red-600">
                  {{ fieldErrors.tipoCuenta }}
                </p>
              </div>

              <div>
                <label class="mb-1.5 block text-[13px] font-medium text-[#1a253f]">Banco</label>
                <div class="relative">
                  <select v-model="entidadId" :class="selectClass">
                    <option value="" disabled>
                      Selecciona
                    </option>
                    <option
                      v-for="b in banks"
                      :key="String(b.id)"
                      :value="String(b.id)"
                    >
                      {{ b.name }}
                    </option>
                  </select>
                </div>
                <p v-if="fieldErrors.entidadId" class="mt-1 text-[12px] text-red-600">
                  {{ fieldErrors.entidadId }}
                </p>
              </div>

              <div class="rounded-lg border border-[#b8d4f0] bg-[#e8f2fc] px-3 py-2.5 text-[12px] leading-snug text-[#1a4a6e]">
                Operamos en Lima con todos los bancos. Y en provincia con el BCP y cuentas digitales Interbank.
              </div>

              <div>
                <span class="mb-1.5 block text-[13px] font-medium text-[#1a253f]">Moneda</span>
                <div class="inline-flex rounded-lg border border-[#dfe4ec] p-0.5">
                  <button
                    type="button"
                    class="rounded-md px-4 py-2 text-[13px] font-semibold transition"
                    :class="moneda === 'PEN' ? 'bg-[#07122c] text-white' : 'text-[#5c6578]'"
                    @click="moneda = 'PEN'"
                  >
                    SOLES
                  </button>
                  <button
                    type="button"
                    class="rounded-md px-4 py-2 text-[13px] font-semibold transition"
                    :class="moneda === 'USD' ? 'bg-[#07122c] text-white' : 'text-[#5c6578]'"
                    @click="moneda = 'USD'"
                  >
                    DÓLARES
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="mb-1.5 block text-[13px] font-medium text-[#1a253f]">Número de cuenta</label>
                <input
                  v-model="numeroCuenta"
                  type="text"
                  inputmode="numeric"
                  autocomplete="off"
                  placeholder="Escribe tu cuenta destino"
                  :class="inputClass"
                >
                <p v-if="fieldErrors.numeroCuenta" class="mt-1 text-[12px] text-red-600">
                  {{ fieldErrors.numeroCuenta }}
                </p>
              </div>

              <div>
                <label class="mb-1.5 block text-[13px] font-medium text-[#1a253f]">Ponle nombre a tu cuenta</label>
                <input
                  v-model="alias"
                  type="text"
                  autocomplete="off"
                  placeholder="Escribe un alias"
                  :class="inputClass"
                >
                <p v-if="fieldErrors.alias" class="mt-1 text-[12px] text-red-600">
                  {{ fieldErrors.alias }}
                </p>
              </div>

              <label class="flex cursor-pointer gap-2 text-[13px] leading-snug text-[#1a253f]">
                <input v-model="esPropietario" type="checkbox" class="mt-0.5 h-4 w-4 shrink-0 rounded border-[#cfd6e6] text-[#07122c]">
                <span>Declaro que esta cuenta es mía y NO de un tercero. Es obligatorio que la cuenta esté a tu nombre para que el cambio sea exitoso.</span>
              </label>
              <p v-if="fieldErrors.esPropietario" class="text-[12px] text-red-600">
                {{ fieldErrors.esPropietario }}
              </p>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              type="button"
              class="w-full rounded-lg bg-[#95e8df] px-8 py-3.5 text-[14px] font-semibold uppercase tracking-wide text-[#07122c] transition hover:bg-[#82ddd2] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
              :disabled="submitting"
              @click="onSubmit"
            >
              Agregar y usar
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
