<script setup lang="ts">
import { ref } from 'vue'
import ConstanciaIcon from '~/features/shared/icons/ConstanciaIcon.vue'

const emit = defineEmits(['submit'])

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const errorMessage = ref('')

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  
  if (target.files && target.files.length > 0) {
    const file = target.files[0]

    if (!file) return 

    if (file.size > 10 * 1024 * 1024) {
      errorMessage.value = 'El archivo es demasiado grande (Máximo 10 MB).'
      selectedFile.value = null
    } else {
      errorMessage.value = ''
      selectedFile.value = file
    }
  }
}

const submitConstancia = () => {
  if (selectedFile.value) {
    emit('submit', selectedFile.value)
  }
}
</script>

<template>
  <main class="flex-1 flex flex-col items-center py-6 md:py-10 px-4">
    <div class="w-full max-w-[400px]">
      
      <div class="bg-white rounded-xl shadow-sm p-6 md:p-8 w-full border border-gray-100">
        
        <div class="w-32 h-32 mx-auto mb-4 flex items-center justify-center">
          <ConstanciaIcon />
          </div>

        <p class="text-[15px] text-gray-600 leading-relaxed text-center mb-6 px-2">
          Adjunta la constancia de tu transferencia para poder verificar tu operación.
        </p>

        <div class="border border-gray-200 rounded-xl p-5 mb-6">
          <p class="text-[13px] text-gray-700 font-medium mb-2">Sube el archivo de tu constancia</p>
          
          <input 
            type="file" 
            ref="fileInput" 
            class="hidden" 
            accept=".pdf, .doc, .docx, image/png, image/jpeg, image/jpg"
            @change="handleFileChange"
          />

          <button 
            @click="triggerFileInput"
            class="w-full border border-gray-300 rounded-lg p-3 text-sm bg-white flex justify-between items-center hover:border-kambista-cyan transition-colors group"
            :class="errorMessage ? 'border-red-400' : ''"
          >
            <span class="truncate pr-2" :class="selectedFile ? 'text-[#060f26] font-medium' : 'text-gray-400'">
              {{ selectedFile ? selectedFile.name : 'Selecciona archivo' }}
            </span>
            <svg class="w-5 h-5 text-[#060f26] shrink-0 group-hover:text-kambista-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /><circle cx="18" cy="18" r="4" fill="currentColor" stroke="none"/><path d="M18 16v4m-2-2h4" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          
          <p v-if="errorMessage" class="text-[11px] text-red-500 mt-2">{{ errorMessage }}</p>
          <p v-else class="text-[11px] text-gray-400 mt-2">*Tamaño máximo permitido del archivo 10 Mb</p>
        </div>

        <div class="text-[13px] text-gray-600 space-y-1">
          <p>Recuerda:</p>
          <ul class="list-disc pl-5 space-y-1">
            <li>El voucher enviado debe tener el <span class="font-bold text-[#060f26]">monto, datos del beneficiario, fecha y hora.</span></li>
            <li>El voucher debe ser legible</li>
            <li>Archivos permitidos <span class="font-bold text-[#060f26]">imágenes, word y PDF</span></li>
          </ul>
        </div>

      </div>

      <div class="pt-6 pb-10">
        <button 
          @click="submitConstancia"
          :disabled="!selectedFile"
          class="w-full bg-[#00e3c2] hover:bg-[#00c9ab] text-[#060f26] font-bold py-3.5 rounded-lg shadow-sm transition-colors uppercase disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar Constancia
        </button>
      </div>

    </div>
  </main>
</template>