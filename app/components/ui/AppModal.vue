<script setup lang="ts">
/**
 * Contenedor de layout para vistas tipo modal.
 * - split: panel lateral + área principal (login Figma: 50/50).
 * - overlay: capa fija con panel centrado (reutilizable en otros flujos).
 */
withDefaults(
  defineProps<{
    variant?: 'split' | 'overlay'
    open?: boolean
    title?: string
  }>(),
  {
    variant: 'split',
    open: true,
    title: '',
  },
)

const emit = defineEmits<{
  close: []
}>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape')
    emit('close')
}
</script>

<template>
  <!-- Split: referencia login (sidebar + formulario). Ver public/login/Login.png -->
  <div
    v-if="variant === 'split'"
    class="flex min-h-screen w-full flex-col lg:flex-row"
  >
    <aside
      v-if="$slots.aside"
      class="flex w-full shrink-0 flex-col lg:w-1/2"
      aria-label="Información del servicio"
    >
      <slot name="aside" />
    </aside>
    <section
      class="flex min-h-[60vh] flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-12 lg:min-h-screen lg:w-1/2"
    >
      <slot />
    </section>
  </div>

  <!-- Overlay -->
  <div
    v-else-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
    role="dialog"
    :aria-label="title || 'Diálogo'"
    aria-modal="true"
    @keydown="onKeydown"
  >
    <div
      class="absolute inset-0"
      aria-hidden="true"
      @click="emit('close')"
    />
    <div
      class="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      role="document"
    >
      <slot />
    </div>
  </div>
</template>
