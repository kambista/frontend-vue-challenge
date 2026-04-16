<script setup lang="ts">
const auth = useAuthStore()

await navigateTo(auth.isAuthenticated ? '/home' : '/auth/login', { replace: true })
</script>

<template>
  <div class="min-h-screen bg-slate-100" />
</template>
