<script setup lang="ts">
useHead({
  title: 'Perfil creado — Kambista',
})

const auth = useAuthStore()

const displayName = computed(() => {
  const n = auth.user?.nombresCompletos?.trim()
  if (!n)
    return null
  return n.split(/\s+/)[0] ?? null
})

async function goHome() {
  await navigateTo('/home')
}

const registerSuccessIllustrationSrc = '/images/register/success-illustration.png'
</script>

<template>
  <div class="relative min-h-screen bg-slate-50">
    <header class="bg-white px-5 py-4 sm:px-8 lg:px-12">
      <img
        src="/images/logo_kambista.png"
        alt="Kambista"
        class="h-10 w-auto sm:h-11"
        width="160"
        height="44"
      >
    </header>

    <main class="flex min-h-[calc(100vh-4.25rem)] flex-col items-center justify-center px-5 pb-28 pt-8 text-center sm:px-8">
      <div class="flex w-full max-w-lg flex-col items-center">
        <img
          :src="registerSuccessIllustrationSrc"
          alt=""
          class="mx-auto h-auto w-full max-w-[min(100%,320px)] object-contain"
          width="520"
          height="420"
        >

        <h1 class="mt-8 max-w-md text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-[1.65rem]">
          ¡Felicitaciones<span v-if="displayName"> {{ displayName }}</span>, tu perfil ha sido creado!
        </h1>

        <p class="mt-4 max-w-md text-base leading-relaxed text-slate-500">
          Ya puedes empezar a <em class="italic text-slate-600">Kambiar</em> con la mejor tasa del mercado
        </p>

        <button
          type="button"
          class="mt-10 w-full max-w-xs cursor-pointer rounded-lg bg-[#00E5BC] py-3.5 text-center text-sm font-bold uppercase tracking-wide text-slate-900 shadow-md shadow-teal-900/10"
          @click="goHome"
        >
          Continuar
        </button>
      </div>
    </main>

    <FloatingWhatsAppButton />
  </div>
</template>
