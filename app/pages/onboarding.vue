<script setup lang="ts">
import InstructionsLogins from '~/features/1_Auth/components/InstructionsLogins.vue'
import RegisterForm from '~/features/1_Auth/components/RegisterForm.vue'

// Esta función atrapará los datos cuando el usuario de clic en "REGISTRARME"
const handleRegisterSubmit = (userData: any) => {
  console.log('Datos recibidos en la página de Onboarding:', userData)
  // Aquí más adelante conectaremos la API para verificar si el correo/DNI ya existe
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

    <section class="w-full lg:w-1/2 bg-[#f5f6f8] flex items-start lg:items-center justify-center px-5 py-10 lg:px-0 lg:py-20 relative overflow-hidden">
      
      <div class="flex justify-center lg:hidden absolute top-6 w-full" data-aos="fade-down">
        <img 
          src="https://app.kambista.com/_nuxt/img/logo.b18e48c.png" 
          alt="Logo Kambista" 
          class="h-12 sm:h-14 w-auto object-contain"
        />
      </div>
      
      <RegisterForm @submit="handleRegisterSubmit" />

    </section>
    
  </main>
</template>