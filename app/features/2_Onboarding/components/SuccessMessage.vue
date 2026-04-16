<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  userName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  userName: 'Usuario'
});

const firstName = computed(() => {
  return props.userName.trim().split(' ')[0]
})
</script>

<template>
  <div class="text-center w-full max-w-sm mx-auto" data-aos="zoom-in">
    
    <img 
      src="https://app.kambista.com/_nuxt/img/phone-kambista.a884cba.png" 
      alt="Registro Exitoso" 
      class="w-20 lg:w-24 h-auto mx-auto mb-6 object-contain"
    />

    <h2 class="text-xl lg:text-2xl font-semibold text-gray-600 mb-2">
      ¡Felicitaciones!
    </h2>
    <p class="text-xl text-gray-600 mb-10">
      {{ firstName }}, tu cuenta ha sido creada
    </p>

    <NuxtLink 
      to="/inicio"
      class="block w-full bg-[#00e3c2] hover:bg-[#00c9ab] text-[#182233] font-semibold py-3.5 rounded-lg transition-colors shadow-sm"
    >
      CONTINUAR
    </NuxtLink>
    
  </div>
</template>