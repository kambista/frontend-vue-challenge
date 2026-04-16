<script setup lang="ts">
import { useOperationStore } from '~/stores/operation'

definePageMeta({ layout: 'auth' })
useHead({ title: 'Inicia sesión | Kambista' })

const operationStore = useOperationStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMsg = ref('')

// ── Validación en tiempo real ────────────────────────────────────────────────
const emailTouched = ref(false)
const passwordTouched = ref(false)

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

const isFormValid = computed(
  () => !emailError.value && !passwordError.value && !!email.value && !!password.value
)

async function handleLogin() {
  emailTouched.value = true
  passwordTouched.value = true
  errorMsg.value = ''
  if (!isFormValid.value) return
  isLoading.value = true
  // Simulated API call
  await new Promise<void>(resolve => setTimeout(resolve, 1000))
  isLoading.value = false
  
  // Guardar email en el store y localStorage
  operationStore.setUserData(email.value.trim())
  
  if (!operationStore.hasCompletedOnboarding) {
    navigateTo('/onboarding')
  } else {
    navigateTo('/dashboard')
  }
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
        <div class="flex justify-center mb-12 lg:hidden">
          <KLogo variant="dark" size="lg" />
        </div>

        <h1 class="text-[28px] font-bold text-gray-900 mb-8 text-center lg:text-left">Inicia sesión</h1>

        <form class="space-y-5" novalidate @submit.prevent="handleLogin">
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

          <KPasswordInput
            v-model="password"
            id="password"
            label="Contraseña"
            placeholder="Escribe tu contraseña"
            :error="passwordError"
            @blur="passwordTouched = true"
          />
          <p v-if="passwordError" role="alert" class="text-xs text-red-500 -mt-3.5 px-1">{{ passwordError }}</p>

          <div class="flex justify-end">
            <NuxtLink to="/forgot-password" class="text-sm text-gray-500 hover:text-kambista-navy underline-offset-2 hover:underline transition-colors">
              ¿Olvidaste tu contraseña?
            </NuxtLink>
          </div>

          <p v-if="errorMsg" role="alert" class="text-sm text-red-500">{{ errorMsg }}</p>

          <KButton type="submit" :loading="isLoading" :disabled="isLoading">
            INICIA SESIÓN
          </KButton>

          <p class="text-center text-sm text-gray-500 pt-1">
            ¿No tienes cuenta?
            <NuxtLink to="/register" class="text-gray-800 font-semibold underline hover:text-kambista-navy transition-colors">
              Regístrate aquí
            </NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
