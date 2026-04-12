<script setup lang="ts">
import InstructionsKambistaLogo from '~/features/shared/icons/InstructionsKambistaLogo.vue';

</script>

<template>
  <div class="z-10 w-full max-w-lg">
        <div class="mb-20 lg:mb-16 flex justify-center"
        data-aos="fade-right"
        data-aos-offset="0"
        >
          <InstructionsKambistaLogo />
        </div>

        <div class="space-y-10">
          <div class="flex items-start gap-5"
          data-aos="fade-right"
          data-aos-delay="100"
          >
            <img 
              src="https://app.kambista.com/_nuxt/img/cotiza-tu-operacion.53c262c.svg" 
              alt="Icono Cotiza" 
              class="w-18 h-18 shrink-0 object-contain"
            />
            <div>
              <h3 class="font-bold text-xl mb-1">Cotiza tu operación</h3>
              <p class="text-sm text-gray-300 leading-relaxed">Utiliza la calculadora para verificar el <span class="text-teal-400 font-semibold">Tipo de Cambio</span> en tiempo real</p>
            </div>
          </div>

          <div class="flex items-start gap-5"
          data-aos="fade-right"
          data-aos-delay="100"
          >
            <img 
              src="https://app.kambista.com/_nuxt/img/realiza-la-transferencia.72c4f40.svg" 
              alt="Icono Cotiza" 
              class="w-18 h-18 shrink-0 object-contain"
            />
            <div>
              <h3 class="font-bold text-xl mb-1">Realiza la transferencia</h3>
              <p class="text-sm text-gray-300 leading-relaxed">Envía desde tu banco el <span class=" font-semibold text-teal-400">dinero</span> que desees cambiar a la <span class="text-teal-400 font-semibold">cuenta</span> de Kambista indicada</p>
            </div>
          </div>

          <div class="flex items-start gap-5"
          data-aos="fade-right"
          data-aos-delay="100"
          >
            <img 
              src="https://app.kambista.com/_nuxt/img/obten-tu-dinero.980735d.svg" 
              alt="Icono Cotiza" 
              class="w-18 h-18 shrink-0 object-contain"
            />
            <div>
              <h3 class="font-bold text-xl mb-1">Obtén tu dinero</h3>
              <p class="text-sm text-gray-300 leading-relaxed">El dinero será <span class="text-teal-400 font-semibold">depositado</span> en tu cuenta de destino</p>
            </div>
          </div>
        </div>
      </div>
</template>