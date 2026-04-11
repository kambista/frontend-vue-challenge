<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { registerSchema } from '~/features/1_Auth/utils/registerSchema'
import BaseInput from '~/features/shared/components/ui/BaseInput.vue'
import BaseCheckbox from '~/features/shared/components/ui/BaseCheckbox.vue'

const { errors, defineField, handleSubmit, meta } = useForm({
  validationSchema: registerSchema,
  initialValues: {
    email: '', confirmEmail: '', password: '', confirmPassword: '',
    acceptTerms: false, acceptPrivacy: false, acceptPromotions: false
  }
})

const [email] = defineField('email')
const [confirmEmail] = defineField('confirmEmail')
const [password] = defineField('password')
const [confirmPassword] = defineField('confirmPassword')
const [acceptTerms] = defineField('acceptTerms')
const [acceptPrivacy] = defineField('acceptPrivacy')
const [acceptPromotions] = defineField('acceptPromotions')

const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const onSubmit = handleSubmit((values) => {
  console.log('Datos listos para registrar:', values)
})
</script>

<template>
  <div class="w-full max-w-sm mx-auto px-5 lg:px-0 pt-16 lg:pt-0">
    
    <h2 class="text-2xl lg:text-3xl font-bold text-kambista-text text-center mb-8" data-aos="fade-up-left">
      ¡Regístrate!
    </h2>

    <form @submit="onSubmit" class="space-y-4">
      
      <BaseInput v-model="email" name="email" label="Correo" placeholder="Escribe tu correo" type="email" :error="errors.email" data-aos="fade-left"/>
      <BaseInput v-model="confirmEmail" name="confirmEmail" label="Confirma correo" placeholder="Confirma tu correo" type="email" :error="errors.confirmEmail" data-aos="fade-left"/>

      <BaseInput v-model="password" name="password" label="Contraseña" placeholder="Escribe tu contraseña" :type="isPasswordVisible ? 'text' : 'password'" :error="errors.password" data-aos="fade-left">
        <template #suffix>
          <button type="button" @click="isPasswordVisible = !isPasswordVisible" class="text-gray-400 hover:text-gray-600 focus:outline-none">
            <svg v-if="isPasswordVisible" fill="currentColor" width="18" height="18" viewBox="0 0 24 24"><path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" /></svg>
            <svg v-else fill="currentColor" width="18" height="18" viewBox="0 0 24 24"><path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" /></svg>
          </button>
        </template>
      </BaseInput>

      <BaseInput v-model="confirmPassword" name="confirmPassword" label="Confirma contraseña" placeholder="Confirma tu contraseña" :type="isConfirmPasswordVisible ? 'text' : 'password'" :error="errors.confirmPassword" data-aos="fade-left">
        <template #suffix>
          <button type="button" @click="isConfirmPasswordVisible = !isConfirmPasswordVisible" class="text-gray-400 hover:text-gray-600 focus:outline-none">
            <svg v-if="isConfirmPasswordVisible" fill="currentColor" width="18" height="18" viewBox="0 0 24 24"><path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" /></svg>
            <svg v-else fill="currentColor" width="18" height="18" viewBox="0 0 24 24"><path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" /></svg>
          </button>
        </template>
      </BaseInput>

      <div class="space-y-3 pt-2" data-aos="fade-up">
        <BaseCheckbox v-model="acceptTerms" name="terms">
          He leído y acepto los <a href="#" class="underline hover:text-kambista-cyan">Términos y condiciones</a>
        </BaseCheckbox>
        <BaseCheckbox v-model="acceptPrivacy" name="privacy">
          Acepto de manera expresa e informada la <a href="#" class="underline hover:text-kambista-cyan">Política de Privacidad</a>
        </BaseCheckbox>
        <BaseCheckbox v-model="acceptPromotions" name="promotions">
          Deseo recibir información sobre promociones, ofertas exclusivas y novedades según la <a href="#" class="underline hover:text-kambista-cyan">Política de Privacidad</a>
        </BaseCheckbox>
      </div>

      <button 
        type="submit"
        :disabled="!meta.valid"
        class="w-full font-semibold py-3.5 rounded-lg transition-all mt-6"
        data-aos-offset="0"
        :class="[!meta.valid ? 'bg-[#c3eadd] text-gray-500 cursor-not-allowed' : 'bg-[#90eed8] hover:bg-kambista-cyan text-kambista-text']"
      >
        REGISTRARME
      </button>

    </form>

    <div class="text-center mt-6" data-aos="fade-up" data-aos-offset="0">
      <NuxtLink to="/login" class="text-sm text-gray-500 hover:text-kambista-cyan underline decoration-gray-300 underline-offset-4">
        ¿Ya tienes cuenta? Ingresa aquí
      </NuxtLink>
    </div>

  </div>
</template>