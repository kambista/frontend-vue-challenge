<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: 'Regístrate | Kambista' })

const operationStore = useOperationStore()

const username    = ref('')
const email       = ref('')
const password    = ref('')
const confirmPassword = ref('')
const isLoading   = ref(false)

// ── Touch state ──────────────────────────────────────────────────────────────
const usernameTouched        = ref(false)
const emailTouched           = ref(false)
const passwordTouched        = ref(false)
const confirmPasswordTouched = ref(false)

// ── Validaciones ─────────────────────────────────────────────────────────────
const usernameError = computed(() => {
  if (!usernameTouched.value) return ''
  if (!username.value.trim()) return 'El nombre de usuario es obligatorio.'
  if (username.value.trim().length < 3) return 'Debe tener al menos 3 caracteres.'
  return ''
})

const emailError = computed(() => {
  if (!emailTouched.value) return ''
  if (!email.value.trim()) return 'El correo es obligatorio.'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) return 'Ingresa un correo electrónico válido.'
  return ''
})

const passwordError = computed(() => {
  if (!passwordTouched.value) return ''
  if (!password.value) return 'La contraseña es obligatoria.'
  if (password.value.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
  return ''
})

const confirmPasswordError = computed(() => {
  if (!confirmPasswordTouched.value) return ''
  if (!confirmPassword.value) return 'Confirma tu contraseña.'
  if (confirmPassword.value !== password.value) return 'Las contraseñas no coinciden.'
  return ''
})

const isFormValid = computed(() =>
  !usernameError.value && !emailError.value &&
  !passwordError.value && !confirmPasswordError.value &&
  !!username.value && !!email.value && !!password.value && !!confirmPassword.value
)

async function handleSubmit() {
  usernameTouched.value = true
  emailTouched.value = true
  passwordTouched.value = true
  confirmPasswordTouched.value = true
  if (!isFormValid.value) return
  isLoading.value = true
  await new Promise<void>(resolve => setTimeout(resolve, 800))
  isLoading.value = false
  
  // Guardar email en el store y localStorage
  operationStore.setUserData(email.value.trim())
  
  navigateTo('/onboarding')
}
</script>

<template>
  <div class="flex min-h-screen">

    <!-- ===================== LEFT PANEL ===================== -->
    <div
      class="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 xl:p-20"
      style="background: linear-gradient(160deg, #111760 0%, #0E1358 55%, #0A0E4A 100%);"
    >
      <!-- Logo -->
      <div class="mb-16 self-start">
        <KLogo variant="white" size="lg" />
      </div>

      <!-- Feature list -->
      <div class="space-y-10 w-full max-w-sm">
        <div class="flex items-start gap-5">
          <img src="/images/Cotiza-tu-operación 2.png" alt="" class="w-[72px] h-[72px] shrink-0 object-contain" onerror="this.style.display='none'" />
          <div>
            <h3 class="text-white font-bold text-lg leading-snug">Cotiza tu operación</h3>
            <p class="text-white/60 text-sm mt-1.5 leading-relaxed">
              Utiliza la calculadora para verificar el <span class="text-kambista-teal font-medium">Tipo de Cambio</span> en tiempo real
            </p>
          </div>
        </div>
        <div class="flex items-start gap-5">
          <img src="/images/realiza-la-transferencia 4.png" alt="" class="w-[72px] h-[72px] shrink-0 object-contain" onerror="this.style.display='none'" />
          <div>
            <h3 class="text-white font-bold text-lg leading-snug">Realiza la transferencia</h3>
            <p class="text-white/60 text-sm mt-1.5 leading-relaxed">
              Envía desde tu banco el <span class="text-kambista-teal font-medium">dinero</span> que desees cambiar a la <span class="text-kambista-teal font-medium">cuenta</span> de Kambista indicada
            </p>
          </div>
        </div>
        <div class="flex items-start gap-5">
          <img src="/images/obten-tu-dinero 3.png" alt="" class="w-[72px] h-[72px] shrink-0 object-contain" onerror="this.style.display='none'" />
          <div>
            <h3 class="text-white font-bold text-lg leading-snug">Obtén tu dinero</h3>
            <p class="text-white/60 text-sm mt-1.5 leading-relaxed">
              El dinero será <span class="text-kambista-teal font-medium">depositado</span> en tu cuenta de destino
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===================== RIGHT PANEL ===================== -->
    <div class="w-full lg:w-1/2 flex items-center justify-center bg-kambista-bg px-6 py-12 sm:px-12">
      <div class="w-full max-w-sm">
        <div class="flex justify-center mb-10 lg:hidden">
          <KLogo variant="dark" size="md" />
        </div>

        <h1 class="text-[28px] font-bold text-gray-900 mb-8">Crea tu cuenta</h1>

        <form class="space-y-5" novalidate @submit.prevent="handleSubmit">
          <KInput
            v-model="email"
            id="email"
            label="Correo electrónico"
            type="email"
            placeholder="Escribe tu correo"
            :error="emailError"
            @blur="emailTouched = true"
          />
          <p v-if="emailError" role="alert" class="text-xs text-red-500 -mt-3.5 px-1">{{ emailError }}</p>

          <KInput
            v-model="username"
            id="username"
            label="Nombre de usuario"
            placeholder="Elige un nombre de usuario"
            :error="usernameError"
            @blur="usernameTouched = true"
          />
          <p v-if="usernameError" role="alert" class="text-xs text-red-500 -mt-3.5 px-1">{{ usernameError }}</p>

          <KPasswordInput
            v-model="password"
            id="password"
            label="Contraseña"
            placeholder="Crea tu contraseña"
            :error="passwordError"
            @blur="passwordTouched = true"
          />
          <p v-if="passwordError" role="alert" class="text-xs text-red-500 -mt-3.5 px-1">{{ passwordError }}</p>

          <KPasswordInput
            v-model="confirmPassword"
            id="confirmPassword"
            label="Confirmar contraseña"
            placeholder="Repite tu contraseña"
            :error="confirmPasswordError"
            @blur="confirmPasswordTouched = true"
          />
          <p v-if="confirmPasswordError" role="alert" class="text-xs text-red-500 -mt-3.5 px-1">{{ confirmPasswordError }}</p>

          <KButton type="submit" :loading="isLoading" :disabled="isLoading">
            CONTINUAR
          </KButton>

          <p class="text-center text-sm text-gray-500 pt-1">
            ¿Ya tienes cuenta?
            <NuxtLink to="/login" class="text-gray-800 font-semibold underline hover:text-kambista-navy transition-colors">
              Inicia sesión aquí
            </NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
