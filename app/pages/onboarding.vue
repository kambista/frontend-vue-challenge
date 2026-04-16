<script setup lang="ts">
import type { APIError } from '~/types/operation'

definePageMeta({ layout: false })
useHead({ title: 'Completa tus datos | Kambista' })

// ── Campos del formulario ────────────────────────────────────────────────────
const fullName    = ref('')
const docType     = ref('')
const docNumber   = ref('')
const phone       = ref('')
const birthDate   = ref('')
const acceptTerms   = ref(false)
const acceptPrivacy = ref(false)
const isLoading     = ref(false)

// ── Touch state para validación on-blur ─────────────────────────────────────
const touched = reactive({
  fullName: false,
  docType: false,
  docNumber: false,
  phone: false,
  birthDate: false,
})

const apiError = ref<APIError['data'] | null>(null)

const docTypes = [
  { value: 'dni',       label: 'DNI' },
  { value: 'ce',        label: 'Carné de extranjería' },
  { value: 'passport',  label: 'Pasaporte' },
]

// ── Validaciones ──────────────────────────────────────────────────────────────
const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/

const fullNameError = computed(() => {
  if (!touched.fullName) return ''
  const v = fullName.value.trim()
  if (!v) return 'El nombre es obligatorio.'
  if (!NAME_REGEX.test(v)) return 'El nombre no debe contener números ni caracteres especiales.'
  if (v.split(' ').length < 2) return 'Ingresa nombre y apellido.'
  return ''
})

const docTypeError = computed(() => {
  if (!touched.docType) return ''
  if (!docType.value) return 'Selecciona el tipo de documento.'
  return ''
})

const docNumberError = computed(() => {
  if (!touched.docNumber) return ''
  if (!docNumber.value.trim()) return 'El número de documento es obligatorio.'
  const v = docNumber.value.trim()
  if (docType.value === 'dni' && !/^\d{8}$/.test(v)) return 'El DNI debe tener 8 dígitos.'
  if (docType.value === 'ce' && !/^\d{9}$/.test(v)) return 'El CE debe tener 9 dígitos.'
  if (docType.value === 'passport' && (v.length < 8 || v.length > 15)) return 'Válido entre 8 y 15 caracteres.'
  return ''
})

const phoneError = computed(() => {
  if (!touched.phone) return ''
  if (!phone.value.trim()) return 'El celular es obligatorio.'
  if (!/^\d{9}$/.test(phone.value.trim())) return 'Debe tener 9 dígitos.'
  return ''
})

const birthDateError = computed(() => {
  if (!touched.birthDate) return ''
  if (!birthDate.value) return 'La fecha es obligatoria.'
  const parts = birthDate.value.split('/')
  if (parts.length !== 3) return 'Usa formato DD/MM/AAAA.'
  const [day, month, year] = parts.map(Number)
  const date = new Date(year, month - 1, day)
  if (isNaN(date.getTime()) || date.getFullYear() !== year) return 'Fecha inválida.'
  const age = new Date().getFullYear() - year
  if (age < 18) return 'Debes ser mayor de 18 años.'
  return ''
})

const pathToDocTypeError = computed(() => docTypeError.value)
const docTypeSheetOpen = ref(false)

const isFormValid = computed(() =>
  !fullNameError.value && !docTypeError.value && !docNumberError.value &&
  !phoneError.value && !birthDateError.value && !!fullName.value &&
  !!docType.value && !!docNumber.value && !!phone.value && !!birthDate.value &&
  acceptTerms.value && acceptPrivacy.value
)

async function handleSubmit() {
  Object.keys(touched).forEach(k => (touched as any)[k] = true)
  apiError.value = null
  if (!isFormValid.value) return
  isLoading.value = true

  try {
    await new Promise<void>(resolve => setTimeout(resolve, 800))
    const firstName = fullName.value.trim().split(' ')[0] ?? ''
    navigateTo({ path: '/bienvenido', query: { name: firstName } })
  } catch (err: any) {
    if (err?.data?.name) apiError.value = err.data
    else apiError.value = { name: 'SERVER_ERROR', title: 'Error', message: 'Ocurrió un error inesperado.' }
  } finally {
    isLoading.value = false
  }
}

function onBirthDateInput(e: Event) {
  const input = e.target as HTMLInputElement
  let v = input.value.replace(/\D/g, '').slice(0, 8)
  if (v.length > 4) v = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`
  else if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`
  birthDate.value = v
}

watch(docNumber, () => { if (apiError.value?.name === 'DUPLICATE_DNI') apiError.value = null })
watch(phone, () => { if (apiError.value?.name === 'INVALID_PHONE') apiError.value = null })
</script>

<template>
  <div class="min-h-screen bg-kambista-bg flex flex-col">
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <KLogo variant="dark" size="md" />
        <NuxtLink to="/login" class="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-kambista-navy transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </NuxtLink>
      </div>
    </header>

    <main class="flex-1 flex justify-center items-start px-4 py-10 sm:py-12">
      <div class="bg-white rounded-2xl shadow-card w-full max-w-lg p-8 sm:p-10">
        <h1 class="text-2xl font-bold text-gray-900 text-center mb-7">Completa tus datos</h1>

        <form class="space-y-5" novalidate @submit.prevent="handleSubmit">
          <KInput
            v-model="fullName"
            id="fullName"
            label="Nombres completos"
            placeholder="Escribe tus nombres y apellidos"
            :error="fullNameError"
            @blur="touched.fullName = true"
          />
          <p v-if="fullNameError" role="alert" class="text-xs text-red-500 -mt-3.5 px-1">{{ fullNameError }}</p>

          <div class="space-y-1.5">
            <span class="text-sm font-medium text-gray-600">Documento</span>
            <div class="flex gap-3">
              <div class="w-[44%]">
                <!-- Desktop select: visible only on desktop -->
                <div class="hidden sm:block">
                  <KSelect v-model="docType" :options="docTypes" placeholder="Tipo" id="docType" :error="docTypeError" />
                </div>
                <!-- Mobile button: visible only on mobile -->
                <button
                  type="button"
                  class="sm:hidden w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-left transition-all flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-kambista-teal/40 focus:border-kambista-teal"
                  :class="docTypeError ? 'border-red-400 focus:ring-red-300' : ''"
                  @click="docTypeSheetOpen = true"
                >
                  <span :class="docType ? 'text-gray-900 font-medium' : 'text-gray-400'">
                    {{ docTypes.find(d => d.value === docType)?.label || 'Tipo' }}
                  </span>
                  <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <p v-if="docTypeError" role="alert" class="text-xs text-red-500 mt-1 px-1">{{ docTypeError }}</p>
              </div>
              <div class="flex-1">
                <KInput v-model="docNumber" id="docNumber" placeholder="Nº de documento" :error="docNumberError || duplicateDniError" @blur="touched.docNumber = true" />
                <p v-if="docNumberError || duplicateDniError" role="alert" class="text-xs text-red-500 mt-1 px-1">{{ docNumberError || duplicateDniError }}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-3 bg-kambista-blue-info-bg rounded-xl p-4">
            <div class="shrink-0 mt-0.5 text-kambista-blue-info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p class="text-sm text-kambista-blue-info-text leading-relaxed">
              Tu documento de identidad debe coincidir con tus datos para evitar inconvenientes al momento de hacer una primera operación
            </p>
          </div>

          <KInput v-model="phone" id="phone" label="Celular" type="tel" placeholder="Nº de celular" :error="phoneError || invalidPhoneError" @blur="touched.phone = true" />
          <p v-if="phoneError || invalidPhoneError" role="alert" class="text-xs text-red-500 -mt-3.5 px-1">{{ phoneError || invalidPhoneError }}</p>

          <div class="flex flex-col gap-1.5">
            <label for="birthDate" class="text-sm font-medium text-gray-600">Fecha de nacimiento</label>
            <input
              id="birthDate" :value="birthDate" type="text" inputmode="numeric" placeholder="DD/MM/AAAA" maxlength="10"
              class="w-full px-4 py-3 bg-white border rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
              :class="birthDateError ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-kambista-teal/40 focus:border-kambista-teal'"
              @input="onBirthDateInput" @blur="touched.birthDate = true"
            />
            <p v-if="birthDateError" role="alert" class="text-xs text-red-500 px-1">{{ birthDateError }}</p>
          </div>

          <div class="space-y-3 pt-1">
            <KCheckbox v-model="acceptTerms" id="terms">
              He leído y acepto los <a href="#" class="text-gray-800 font-semibold underline hover:text-kambista-navy transition-colors">Términos y condiciones</a>
            </KCheckbox>
            <KCheckbox v-model="acceptPrivacy" id="privacy">
              Acepto de manera expresa e informada la <a href="#" class="text-gray-800 font-semibold underline hover:text-kambista-navy transition-colors">Política de Tratamiento de datos personales</a>
            </KCheckbox>
          </div>

          <div class="pt-2">
            <KButton type="submit" :disabled="!isFormValid || isLoading" :loading="isLoading">CONTINUAR</KButton>
          </div>
        </form>
      </div>
    </main>

    <!-- Mobile bottom sheet: tipo de documento -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="docTypeSheetOpen" class="sm:hidden fixed inset-0 z-[60] bg-black/50" @click="docTypeSheetOpen = false" />
      </Transition>
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
      >
        <div v-if="docTypeSheetOpen" class="sm:hidden fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-2xl max-h-[50vh] flex flex-col">
          <div class="flex justify-center pt-3 pb-0.5">
            <div class="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
          <div class="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <p class="text-sm font-bold text-[#1A1A2E]">Tipo de documento</p>
            <button
              class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
              @click="docTypeSheetOpen = false"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>
          <ul class="overflow-y-auto flex-1 divide-y divide-gray-100" role="listbox">
            <li
              v-for="option in docTypes"
              :key="option.value"
              class="px-5 py-4 text-sm text-gray-800 active:bg-gray-50 cursor-pointer"
              :class="docType === option.value ? 'font-semibold text-[#1A1A2E]' : ''"
              role="option"
              @click="() => { docType = option.value; touched.docType = true; docTypeSheetOpen = false }"
            >
              {{ option.label }}
            </li>
          </ul>
        </div>
      </Transition>
    </Teleport>
  </div>

  <WhatsAppButton />
</template>
