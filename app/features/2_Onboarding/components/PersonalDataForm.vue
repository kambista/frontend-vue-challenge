<script setup lang="ts">
import { useForm } from 'vee-validate'
import { personalDataSchema } from '~/features/2_Onboarding/utils/personalDataSchema'
import BaseInput from '~/features/shared/components/ui/BaseInput.vue'
import BaseSelect from '~/features/shared/components/ui/BaseSelect.vue'
import BaseCheckbox from '~/features/shared/components/ui/BaseCheckbox.vue'
import BaseDatePicker from '~/features/shared/components/ui/BaseDatePicker.vue'

const { errors, defineField, handleSubmit, meta, setFieldError } = useForm({
  validationSchema: personalDataSchema,
  initialValues: {
    fullName: '', documentType: 'DNI', documentNumber: '', 
    phone: '', birthDate: '', acceptTerms: false, acceptPrivacy: false
  }
})

const [fullName] = defineField('fullName')
const [documentType] = defineField('documentType')
const [documentNumber] = defineField('documentNumber')
const [phone] = defineField('phone')
const [birthDate] = defineField('birthDate')
const [acceptTerms] = defineField('acceptTerms')
const [acceptPrivacy] = defineField('acceptPrivacy')

const documentOptions = [
  { value: 'DNI', label: 'DNI' },
  { value: 'CE', label: 'CE' },
  { value: 'PASSPORT', label: 'Pasaporte' }
]

const onSubmit = handleSubmit(async (values) => {
  // Simulador de DNI duplicado
  if (values.documentNumber === '12345678') {
    setFieldError('documentNumber', 'El número de documento registrado ya está en uso.')
    return;
  }
  console.log('Datos listos:', values)
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-lg mx-auto p-8 lg:p-10" data-aos="fade-up">
    
    <h2 class="text-2xl font-bold text-gray-800 text-center mb-8">
      Completa tus datos
    </h2>

    <form @submit="onSubmit" class="space-y-5">
      
      <BaseInput v-model="fullName" name="fullName" label="Nombres completos" placeholder="Escribe tus nombres y apellidos" :error="errors.fullName" />

      <div>
        <label class="text-sm text-gray-500 mb-1 block">Documento</label>
        <div class="flex gap-3 items-start">
          <div class="w-1/3">
            <BaseSelect v-model="documentType" name="documentType" :options="documentOptions" :error="errors.documentType" />
          </div>
          <div class="w-2/3">
            <BaseInput v-model="documentNumber" name="documentNumber" placeholder="Nº de documento" :error="errors.documentNumber" />
          </div>
        </div>
      </div>

      <div class="bg-[#D2E9FF] border border-[#d6e6f5] rounded-lg p-4 flex gap-3 items-start">
        <svg class="w-5 h-5 text-kambista-cyan shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-xs text-gray-600 leading-relaxed">
          Tu documento de identidad debe coincidir con tus datos para evitar inconvenientes al momento de hacer una primera operación
        </p>
      </div>

      <BaseInput v-model="phone" name="phone" label="Celular" placeholder="Nº de celular" :error="errors.phone" />
      
      <BaseDatePicker 
        v-model="birthDate" 
        name="birthDate" 
        label="Fecha de nacimiento" 
        placeholder="dd-mm-aaaa"
        :error="errors.birthDate" 
        />
      <div class="space-y-3 pt-2">
        <BaseCheckbox v-model="acceptTerms" name="termsData">
          He leído y acepto los <a href="#" class="font-semibold underline">Términos y condiciones</a>
        </BaseCheckbox>
        <BaseCheckbox v-model="acceptPrivacy" name="privacyData">
          Acepto de manera expresa e informada la <a href="#" class="font-semibold underline">Política de Tratamiento de datos personales de Kambista</a>
        </BaseCheckbox>
      </div>

      <button 
        type="submit"
        :disabled="!meta.valid"
        class="w-full font-semibold py-3.5 rounded-lg transition-all mt-4"
        :class="[!meta.valid ? 'bg-[#c3eadd] text-gray-500 cursor-not-allowed' : 'bg-[#90eed8] hover:bg-kambista-cyan text-kambista-text']"
      >
        CONTINUAR
      </button>

    </form>
  </div>
</template>