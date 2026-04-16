<template>
  <div class="flex-1 flex flex-col px-4 py-6">
    <div class="w-full max-w-lg mx-auto">

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">

        <!-- Illustration -->
        <img
          src="/images/complete_data_operation/image 3.png"
          alt="Adjunta tu constancia"
          class="w-24 h-24 object-contain block mx-auto mb-4"
          onerror="this.style.display='none'"
        />

        <!-- Description -->
        <p class="text-sm text-gray-600 text-center mb-5 leading-relaxed">
          Adjunta la constancia de tu transferencia para poder verificar
          tu operación.
        </p>

        <!-- File upload section -->
        <div class="border rounded-xl p-4 mb-5 transition-colors" :class="fileError ? 'border-red-200 bg-red-50/30' : 'border-gray-200'">
          <p class="text-sm font-medium text-[#1A1A2E] mb-3">
            Sube el archivo de tu constancia
          </p>

          <!-- Preview section -->
          <div v-if="uploadedFile" class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div class="flex items-start justify-between gap-3">
              <!-- File preview thumbnail -->
              <div class="flex items-center gap-3 flex-1">
                <!-- Image preview -->
                <div v-if="isImageFile" class="flex-shrink-0">
                  <img
                    :src="filePreview"
                    :alt="uploadedFile.name"
                    class="w-12 h-12 rounded object-cover border border-gray-200"
                  />
                </div>
                <!-- Document preview -->
                <div v-else class="flex-shrink-0 w-12 h-12 rounded bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <svg v-if="isPdf" class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8 4a2 2 0 012-2h4a1 1 0 011 1v12a1 1 0 11-2 0V5H9a1 1 0 00-1 1v10a1 1 0 11-2 0V4zm3-3a6 6 0 00-6 6v12a2 2 0 002 2h8a2 2 0 002-2V7a6 6 0 00-6-6z" clip-rule="evenodd" />
                  </svg>
                </div>

                <!-- File info -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-[#1A1A2E] truncate">
                    {{ uploadedFile.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ fileSize }}
                  </p>
                </div>
              </div>

              <!-- Remove button -->
              <button
                type="button"
                @click="removeFile"
                class="flex-shrink-0 p-1.5 hover:bg-red-50 rounded transition-colors"
                title="Cambiar archivo"
              >
                <svg class="w-5 h-5 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Upload input -->
          <label
            class="flex items-center justify-between w-full px-4 py-3 border rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-white shadow-sm"
            :class="fileError ? 'border-red-300' : 'border-gray-200'"
          >
            <span class="text-sm truncate max-w-[70%]" :class="uploadedFile ? 'text-gray-400' : 'text-gray-400'">
              {{ uploadedFile ? 'Cambiar archivo' : 'Selecciona archivo' }}
            </span>
            <img src="/images/complete_data_operation/upload_icon.png" alt="Upload Icon" class="w-6 h-6 scale-125 object-contain" onerror="this.style.display='none'" />
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              class="hidden"
              aria-label="Selecciona el archivo de tu constancia"
              @change="handleFileChange"
            />
          </label>

          <p v-if="fileError" class="text-xs text-red-500 mt-2 font-medium">
            {{ fileError }}
          </p>
          <p v-else class="text-xs text-gray-400 mt-2">
            *Tamaño máximo permitido del archivo 10 Mb
          </p>
        </div>

        <!-- Recuerda section -->
        <div>
          <p class="text-sm font-medium text-[#1A1A2E] mb-2">Recuerda:</p>
          <ul class="text-sm text-gray-600 space-y-1.5 pl-4 list-disc leading-relaxed">
            <li>
              El voucher enviado debe tener el
              <strong>monto, datos del beneficiario, fecha y hora.</strong>
            </li>
            <li>El voucher debe ser legible</li>
            <li>Archivos permitidos <strong>imágenes, word y PDF</strong></li>
          </ul>
        </div>
      </div>

      <!-- CTA -->
      <button
        type="button"
        class="w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200"
        :class="uploadedFile && !fileError
          ? 'bg-[#00D4C8] text-white hover:bg-[#00BFB4] active:scale-[0.98]'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
        :disabled="!uploadedFile || !!fileError"
        @click="handleSubmit"
      >
        ENVIAR CONSTANCIA
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
  submit: []
}>()

const uploadedFile = ref<File | null>(null)
const fileError = ref('')
const filePreview = ref('')

const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

const isImageFile = computed(() => {
  if (!uploadedFile.value) return false
  return uploadedFile.value.type.startsWith('image/')
})

const isPdf = computed(() => {
  if (!uploadedFile.value) return false
  return uploadedFile.value.type === 'application/pdf'
})

const fileSize = computed(() => {
  if (!uploadedFile.value) return ''
  const bytes = uploadedFile.value.size
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
})

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  fileError.value = ''
  filePreview.value = ''
  
  if (!file) {
    uploadedFile.value = null
    return
  }

  // Validate size
  if (file.size > MAX_SIZE) {
    fileError.value = 'El archivo supera el tamaño máximo permitido (10 MB).'
    uploadedFile.value = null
    target.value = '' // Reset input
    return
  }

  // Validate type
  if (!ALLOWED_TYPES.includes(file.type)) {
    fileError.value = 'Formato de archivo no permitido. Solo imágenes, Word o PDF.'
    uploadedFile.value = null
    target.value = '' // Reset input
    return
  }

  uploadedFile.value = file

  // Generate preview for images
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      filePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function removeFile() {
  uploadedFile.value = null
  fileError.value = ''
  filePreview.value = ''
  // Reset the file input
  const fileInputs = document.querySelectorAll('input[type="file"]')
  fileInputs.forEach(input => {
    (input as HTMLInputElement).value = ''
  })
}

function handleSubmit() {
  if (uploadedFile.value && !fileError.value) {
    emit('submit')
  }
}
</script>
