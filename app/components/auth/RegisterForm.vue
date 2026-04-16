<script setup lang="ts">
import type { RegisterPayload } from '~/composables/useAuthApi'
import type { TipoDocumentoForm } from '~/composables/useValidation'

const auth = useAuthStore()
const {
  validateEmail,
  validatePassword,
  validateFullName,
  validateDocumentType,
  validateDocumentNumber,
  validatePhone,
  validateBirthDate,
  birthDateToIso,
} = useValidation()

const email = ref('')
const password = ref('')
const emailError = ref<string | null>(null)
const passwordError = ref<string | null>(null)
const touchedEmail = ref(false)
const touchedPassword = ref(false)

const fullName = ref('')
const fullNameError = ref<string | null>(null)
const touchedFullName = ref(false)

const documentType = ref<TipoDocumentoForm>('')
const documentTypeError = ref<string | null>(null)
const touchedDocumentType = ref(false)

const documentNumber = ref('')
const documentNumberError = ref<string | null>(null)
const touchedDocumentNumber = ref(false)

const phoneNumber = ref('')
const phoneError = ref<string | null>(null)
const touchedPhone = ref(false)

const birthDate = ref('')
const birthDateError = ref<string | null>(null)
const touchedBirthDate = ref(false)

const acceptTerms = ref(false)
const acceptPrivacy = ref(false)

function runEmailValidation() {
  emailError.value = validateEmail(email.value)
}

function runPasswordValidation() {
  passwordError.value = validatePassword(password.value)
}

function runFullNameValidation() {
  fullNameError.value = validateFullName(fullName.value)
}

function runDocumentTypeValidation() {
  documentTypeError.value = validateDocumentType(documentType.value)
}

function runDocumentNumberValidation() {
  documentNumberError.value = validateDocumentNumber(documentType.value, documentNumber.value)
}

function runPhoneValidation() {
  phoneError.value = validatePhone(phoneNumber.value)
}

function runBirthDateValidation() {
  birthDateError.value = validateBirthDate(birthDate.value)
}

watch(email, () => {
  if (touchedEmail.value)
    runEmailValidation()
})

watch(password, () => {
  if (touchedPassword.value)
    runPasswordValidation()
})

watch(fullName, () => {
  if (touchedFullName.value)
    runFullNameValidation()
})

watch(documentType, () => {
  if (touchedDocumentType.value) {
    runDocumentTypeValidation()
    runDocumentNumberValidation()
  }
})

watch(documentNumber, () => {
  if (touchedDocumentNumber.value)
    runDocumentNumberValidation()
})

watch(phoneNumber, () => {
  if (touchedPhone.value)
    runPhoneValidation()
})

watch(birthDate, () => {
  if (touchedBirthDate.value)
    runBirthDateValidation()
})

function onEmailBlur() {
  touchedEmail.value = true
  runEmailValidation()
}

function onPasswordBlur() {
  touchedPassword.value = true
  runPasswordValidation()
}

function onFullNameBlur() {
  touchedFullName.value = true
  runFullNameValidation()
}

function onDocumentTypeInteraction() {
  touchedDocumentType.value = true
  runDocumentTypeValidation()
  runDocumentNumberValidation()
}

function onDocumentNumberBlur() {
  touchedDocumentNumber.value = true
  runDocumentNumberValidation()
}

function onPhoneBlur() {
  touchedPhone.value = true
  runPhoneValidation()
}

function onBirthDateBlur() {
  touchedBirthDate.value = true
  runBirthDateValidation()
}

const fieldsValid = computed(() => {
  return (
    !validateEmail(email.value)
    && !validatePassword(password.value)
    && !validateFullName(fullName.value)
    && !validateDocumentType(documentType.value)
    && !validateDocumentNumber(documentType.value, documentNumber.value)
    && !validatePhone(phoneNumber.value)
    && !validateBirthDate(birthDate.value)
  )
})

const formValid = computed(
  () => fieldsValid.value && acceptTerms.value && acceptPrivacy.value,
)

const showGlobalError = computed(
  () => auth.error && !auth.isLoading,
)

async function onSubmit() {
  touchedEmail.value = true
  touchedPassword.value = true
  touchedFullName.value = true
  touchedDocumentType.value = true
  touchedDocumentNumber.value = true
  touchedPhone.value = true
  touchedBirthDate.value = true

  runEmailValidation()
  runPasswordValidation()
  runFullNameValidation()
  runDocumentTypeValidation()
  runDocumentNumberValidation()
  runPhoneValidation()
  runBirthDateValidation()

  if (!fieldsValid.value || !acceptTerms.value || !acceptPrivacy.value)
    return

  const iso = birthDateToIso(birthDate.value)
  if (!iso)
    return

  auth.clearError()

  const registered = await auth.register({
    email: email.value.trim(),
    password: password.value,
    nombresCompletos: fullName.value.trim(),
    tipoDocumento: documentType.value as RegisterPayload['tipoDocumento'],
    numeroDocumento: documentNumber.value.trim(),
    celular: phoneNumber.value.trim().replace(/\s/g, ''),
    fechaNacimiento: iso,
  })

  if (registered)
    await navigateTo('/auth/register/success')
}

const selectDocId = useId()
const checkboxTermsId = useId()
const checkboxPrivacyId = useId()
const selectDocClass = computed(() =>
  [
    'h-[46px] w-full cursor-pointer appearance-none rounded-lg border bg-white px-3 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2',
    touchedDocumentType.value && documentTypeError.value
      ? 'border-red-300 focus:border-red-400 focus:ring-red-400/30'
      : 'border-slate-200 focus:border-teal-400 focus:ring-teal-400/30',
  ].join(' '),
)
</script>

<template>
  <div
    class="w-full max-w-[520px] rounded-2xl border border-slate-100 bg-white px-8 py-8 shadow-[0_6px_24px_rgba(15,23,42,0.06)] sm:px-9"
  >
    <h1 class="text-center text-2xl font-bold leading-none tracking-tight text-slate-900 sm:text-3xl">
      Completa tus datos
    </h1>

    <form class="mt-7 space-y-4" novalidate @submit.prevent="onSubmit">
      <AppInput
        v-model="email"
        label="Correo electrónico"
        type="email"
        placeholder="Escribe tu correo"
        autocomplete="email"
        :error="touchedEmail ? emailError : null"
        class="!max-w-none [&>label]:mb-1 [&>label]:text-sm [&>label]:font-medium [&>label]:text-slate-500 [&_input]:rounded-lg [&_input]:px-4 [&_input]:py-2.5 [&_input]:text-sm"
        @blur="onEmailBlur"
      />

      <AppInput
        v-model="password"
        label="Contraseña"
        type="password"
        placeholder="Mínimo 8 caracteres"
        autocomplete="new-password"
        show-password-toggle
        :error="touchedPassword ? passwordError : null"
        class="!max-w-none [&>label]:mb-1 [&>label]:text-sm [&>label]:font-medium [&>label]:text-slate-500 [&_input]:rounded-lg [&_input]:px-4 [&_input]:py-2.5 [&_input]:text-sm"
        @blur="onPasswordBlur"
      />

      <AppInput
        v-model="fullName"
        label="Nombres completos"
        type="text"
        placeholder="Escribe tus nombres y apellidos"
        autocomplete="name"
        :error="touchedFullName ? fullNameError : null"
        class="!max-w-none [&>label]:mb-1 [&>label]:text-sm [&>label]:font-medium [&>label]:text-slate-500 [&_input]:rounded-lg [&_input]:px-4 [&_input]:py-2.5 [&_input]:text-sm"
        @blur="onFullNameBlur"
      />

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-500" :for="selectDocId">Documento</label>
        <div class="grid grid-cols-1 gap-2 sm:grid-cols-[145px_1fr]">
          <div class="relative">
            <select
              :id="selectDocId"
              v-model="documentType"
              :class="selectDocClass"
              aria-label="Tipo de documento"
              @blur="onDocumentTypeInteraction"
              @change="onDocumentTypeInteraction"
            >
              <option value="" disabled>
                Tipo
              </option>
              <option value="dni">
                DNI
              </option>
              <option value="cce">
                CE
              </option>
              <option value="pasaporte">
                Pasaporte
              </option>
            </select>
            <svg
              class="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <AppInput
            v-model="documentNumber"
            label=""
            type="text"
            :placeholder="documentType === 'pasaporte' ? 'Nº de documento' : 'Solo números'"
            autocomplete="off"
            :error="touchedDocumentNumber ? documentNumberError : null"
            class="!max-w-none [&>label]:hidden [&_input]:rounded-lg [&_input]:px-4 [&_input]:py-2.5 [&_input]:text-sm"
            @blur="onDocumentNumberBlur"
          />
        </div>
        <p
          v-if="touchedDocumentType && documentTypeError"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          {{ documentTypeError }}
        </p>

        <div
          class="mt-3 flex gap-2 rounded-lg border border-[#cde8ff] bg-[#d7ecff] px-3 py-2.5 text-xs leading-tight text-[#0d4f8c]"
        >
          <span
            class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#2671bb] text-[10px] font-semibold text-[#2671bb]"
            aria-hidden="true"
          >
            i
          </span>
          <p>
            Tu documento de identidad debe coincidir con tus datos para evitar inconvenientes al momento de hacer una primera operación
          </p>
        </div>
      </div>

      <AppInput
        v-model="phoneNumber"
        label="Celular"
        type="text"
        inputmode="numeric"
        placeholder="9 dígitos"
        autocomplete="tel"
        :error="touchedPhone ? phoneError : null"
        class="!max-w-none [&>label]:mb-1 [&>label]:text-sm [&>label]:font-medium [&>label]:text-slate-500 [&_input]:rounded-lg [&_input]:px-4 [&_input]:py-2.5 [&_input]:text-sm"
        @blur="onPhoneBlur"
      />

      <AppInput
        v-model="birthDate"
        label="Fecha de nacimiento"
        type="text"
        placeholder="DD/MM/AAAA"
        autocomplete="bday"
        :error="touchedBirthDate ? birthDateError : null"
        class="!max-w-none [&>label]:mb-1 [&>label]:text-sm [&>label]:font-medium [&>label]:text-slate-500 [&_input]:rounded-lg [&_input]:px-4 [&_input]:py-2.5 [&_input]:text-sm"
        @blur="onBirthDateBlur"
      />

      <div class="space-y-2.5 pt-1">
        <label
          class="flex cursor-pointer items-start gap-2 text-xs leading-tight text-slate-600"
          :for="checkboxTermsId"
        >
          <input
            :id="checkboxTermsId"
            v-model="acceptTerms"
            type="checkbox"
            class="mt-0.5 h-[15px] w-[15px] shrink-0 rounded border-slate-300 text-teal-500 accent-[#00E5BC] focus:ring-2 focus:ring-teal-400/40"
          >
          <span>
            He leído y acepto los
            <a
              href="#"
              class="font-semibold text-slate-900 underline underline-offset-2 hover:text-teal-800"
              @click.prevent
            >Términos y condiciones</a>
          </span>
        </label>
        <label
          class="flex cursor-pointer items-start gap-2 text-xs leading-tight text-slate-600"
          :for="checkboxPrivacyId"
        >
          <input
            :id="checkboxPrivacyId"
            v-model="acceptPrivacy"
            type="checkbox"
            class="mt-0.5 h-[15px] w-[15px] shrink-0 rounded border-slate-300 text-teal-500 accent-[#00E5BC] focus:ring-2 focus:ring-teal-400/40"
          >
          <span>
            Acepto de manera expresa e informada la
            <a
              href="#"
              class="font-semibold text-slate-900 underline underline-offset-2 hover:text-teal-800"
              @click.prevent
            >Política de Tratamiento de datos personales de Kambista</a>
          </span>
        </label>
      </div>

      <p v-if="showGlobalError" class="rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-700" role="alert">
        {{ auth.error }}
      </p>

      <AppButton
        type="submit"
        :disabled="!formValid"
        :loading="auth.isLoading"
        class="mt-2 !max-w-none !rounded-lg !py-3 !text-sm !font-medium !tracking-wide"
      >
        Registrarte
      </AppButton>
    </form>
  </div>
</template>
