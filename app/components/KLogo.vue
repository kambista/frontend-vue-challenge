<script setup lang="ts">
withDefaults(defineProps<{
  /** 'white' = logo blanco para fondos oscuros | 'dark' = logo negro para fondos claros */
  variant?: 'white' | 'dark'
  size?: 'sm' | 'md' | 'lg'
}>(), {
  variant: 'white',
  size: 'md',
})
</script>

<template>
  <NuxtLink to="/" class="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-kambista-teal rounded">
    <img
      :src="variant === 'white' ? '/images/logo_kambista.png' : '/images/logo-kambista-sinfondo-variante.png'"
      alt="Kambista"
      :class="[
        size === 'sm' ? 'h-7' : size === 'lg' ? 'h-14' : 'h-10',
      ]"
    />
  </NuxtLink>
</template>
