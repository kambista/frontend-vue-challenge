<script setup lang="ts">
import { useForm } from 'vee-validate'
import { loginSchema } from '~/features/1_Auth/utils/loginSchema'
import InstructionsLogins from '~/features/1_Auth/components/InstructionsLogins.vue'
import BaseInput from '~/features/shared/components/ui/BaseInput.vue'

const { errors, defineField, handleSubmit, meta } = useForm({
  validationSchema: loginSchema,
  initialValues: {
    email: '',
    password: ''
  }
})

const [email] = defineField('email')
const [password] = defineField('password')

const isPasswordVisible = ref(false)
const togglePassword = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const onSubmit = handleSubmit((values) => {
  console.log('Formulario válido, enviando:', values)
})
</script>

<template>
  <main class="min-h-screen flex w-full font-sans">
    <section 
        class="hidden lg:flex w-1/2 flex-col justify-center px-16 xl:px-24 text-white relative"
        style="background: linear-gradient(20.06deg, #182233 26.91%, #1d2744 45.75%, #293571 83.1%, #344197 110.93%);"
        >
      <InstructionsLogins />
    </section>

    <section class="w-full lg:w-1/2 bg-[#f5f6f8] flex items-start lg:items-center justify-center p-6 pt-20 lg:p-12">
      <div class="w-full max-w-md">
        
        <div class="flex justify-center mb-8 lg:hidden">
          <img 
            src="https://app.kambista.com/_nuxt/img/logo.b18e48c.png" 
            alt="Logo Kambista" 
            class="h-8 w-auto object-contain"
          />
        </div>

        <h2 class="text-2xl font-medium text-gray-600 text-center mb-8 lg:text-3xl lg:font-bold lg:text-kambista-text lg:text-left">
          Inicia sesión
        </h2>

        <form @submit="onSubmit" class="space-y-5">
          
          <BaseInput
            v-model="email"
            name="email"
            label="Correo"
            placeholder="Escribe tu correo"
            type="email"
            :error="errors.email"
          />

          <BaseInput
            v-model="password"
            name="password"
            label="Contraseña"
            placeholder="Escribe tu contraseña"
            :type="isPasswordVisible ? 'text' : 'password'"
            :error="errors.password"
          >
            <template #suffix>
              <button 
                type="button" 
                @click="togglePassword" 
                class="flex items-center justify-center p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                aria-label="Toggle password visibility"
              >
                <svg v-if="isPasswordVisible" fill="currentColor" width="18" height="18" viewBox="0 0 24 24">
                  <path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" />
                </svg>

                <svg v-else fill="currentColor" width="18" height="18" viewBox="0 0 24 24">
                  <path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" />
                </svg>
              </button>
            </template>
          </BaseInput>

          <div class="text-center pt-2">
            <a href="#" class="text-sm text-gray-400 hover:text-kambista-cyan transition-colors">
              Olvidé mi contraseña
            </a>
          </div>

          <button 
            type="submit"
            :disabled="!meta.valid"
            class="w-full font-semibold py-3.5 rounded-lg transition-all mt-4"
            :class="[
              !meta.valid 
                ? 'bg-[#c3eadd] text-gray-500 cursor-not-allowed'
                : 'bg-[#90eed8] hover:bg-kambista-cyan text-kambista-text'
            ]"
          >
            INICIAR SESIÓN
          </button>
        </form>

        <p class="text-center text-sm text-gray-400 mt-8">
          ¿No tienes cuenta? 
          <NuxtLink to="/onboarding" class="text-gray-500 hover:text-kambista-cyan transition-colors underline decoration-gray-300 underline-offset-4">
            Regístrate aquí
          </NuxtLink>
        </p>

      </div>
    </section>
  </main>
</template>