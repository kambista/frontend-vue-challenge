<script setup lang="ts">
import InstructionsLogins from '~/features/1_Auth/components/InstructionsLogins.vue'
import LoginForm from '~/features/1_Auth/components/LoginForm.vue'

const handleLoginSubmit = (credentials: any) => {
  console.log('Credenciales recibidas en la página principal:', credentials)
}

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
                
        <div class="flex justify-center mb-8 lg:hidden absolute top-6 w-full max-w-md">
        <img 
          src="https://app.kambista.com/_nuxt/img/logo.b18e48c.png" 
          alt="Logo Kambista" 
          class="h-8 w-auto object-contain"
        />
        </div>

        <LoginForm @submit="handleLoginSubmit" />
    
    </section>
  </main>
</template>