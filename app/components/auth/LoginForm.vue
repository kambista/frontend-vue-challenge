<script setup lang="ts">
const auth = useAuthStore()
const { validateEmail, validatePassword } = useValidation()

const email = ref('')
const password = ref('')
const emailError = ref<string | null>(null)
const passwordError = ref<string | null>(null)
const touchedEmail = ref(false)
const touchedPassword = ref(false)

function runEmailValidation() {
  emailError.value = validateEmail(email.value)
}

function runPasswordValidation() {
  passwordError.value = validatePassword(password.value)
}

watch(email, () => {
  if (touchedEmail.value)
    runEmailValidation()
})

watch(password, () => {
  if (touchedPassword.value)
    runPasswordValidation()
})

function onEmailBlur() {
  touchedEmail.value = true
  runEmailValidation()
}

function onPasswordBlur() {
  touchedPassword.value = true
  runPasswordValidation()
}

const formValid = computed(() => {
  return (
    !validateEmail(email.value)
    && !validatePassword(password.value)
  )
})

async function onSubmit() {
  touchedEmail.value = true
  touchedPassword.value = true

  runEmailValidation()

  runPasswordValidation()

  if (!formValid.value) return

  auth.clearError()

  await auth.login({ email: email.value.trim(), password: password.value })

  if (auth.isAuthenticated) await navigateTo('/home')
}

const showGlobalError = computed(
  () => auth.error && !auth.isLoading,
)

const goToRegister = () => navigateTo('/auth/register');
</script>

<template>
  <div class="flex w-full max-w-md flex-col items-stretch gap-6">
    <h1 class="text-center text-2xl font-bold text-slate-900 md:text-3xl">
      Inicia sesión
    </h1>

    <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
      <AppInput v-model="email" label="Correo electrónico" type="email" autocomplete="email"
        placeholder="Escribe tu correo" :error="touchedEmail ? emailError : null" @blur="onEmailBlur" />

      <AppInput v-model="password" label="Contraseña" type="password" autocomplete="current-password"
        placeholder="Escribe tu contraseña" show-password-toggle :error="touchedPassword ? passwordError : null"
        @blur="onPasswordBlur" />

      <div class="flex justify-end">
        <a href="#"
          class="text-sm text-slate-500 underline decoration-slate-400 underline-offset-2 hover:text-slate-700"
          @click.prevent>¿Olvidaste tu contraseña?</a>
      </div>

      <p v-if="showGlobalError" class="rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-700" role="alert">
        {{ auth.error }}
      </p>

      <p v-if="auth.isAuthenticated" class="rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-800"
        role="status">
        Sesión iniciada correctamente (demo).
      </p>

      <AppButton type="submit" :disabled="!formValid" :loading="auth.isLoading">
        Inicia sesión
      </AppButton>
    </form>

    <p class="text-center text-sm text-slate-600">
      ¿No tienes cuenta?
      <button
        class="font-medium text-slate-900 underline decoration-slate-400 underline-offset-2 hover:text-teal-700 cursor-pointer"
        @click="goToRegister">Regístrate aquí</button>
    </p>
  </div>
</template>
