<script setup lang="ts">
import type { UserCuenta } from '~/composables/useKambistaApi'

const props = defineProps<{
  open: boolean
  accounts: UserCuenta[]
  pending: boolean
  loadError: boolean
  moneda: 'PEN' | 'USD'
  selectedAccountId: string | null
}>()

const emit = defineEmits<{
  close: []
  select: [id: string]
  add: []
}>()

function maskNum(raw: string | undefined) {
  if (!raw)
    return '—'
  const d = String(raw).replace(/\D/g, '')
  if (d.length <= 4)
    return d
  return `•••• •••• ${d.slice(-4)}`
}

const title = computed(() => (props.moneda === 'PEN' ? 'Cuentas Soles' : 'Cuentas Dólares'))

const filtered = computed(() =>
  props.accounts.filter((a) => {
    const m = String(a.moneda ?? '').toUpperCase()
    if (props.moneda === 'PEN')
      return m === 'PEN' || m === 'SOLES'
    return m === 'USD'
  }),
)

function pick(c: UserCuenta) {
  emit('select', String(c.id))
}

function onBackdropClick() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div class="absolute inset-0" aria-hidden="true" @click="onBackdropClick" />
      <div
        class="relative z-10 flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-xl"
      >
        <header class="flex shrink-0 items-start justify-between gap-3 bg-[#07122c] px-4 py-4 text-white sm:px-5">
          <div class="min-w-0">
            <h2 class="text-lg font-bold leading-tight">
              {{ title }}
            </h2>
            <p class="mt-1 text-[13px] font-medium text-white/85">
              Selecciona tu cuenta de destino
            </p>
          </div>
          <button
            type="button"
            class="shrink-0 rounded p-1 text-xl leading-none text-white/90 hover:bg-white/10"
            aria-label="Cerrar"
            @click="emit('close')"
          >
            ×
          </button>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4">
          <p v-if="loadError" class="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-800">
            No se pudieron cargar tus cuentas.
          </p>
          <p v-else-if="pending" class="py-8 text-center text-[14px] text-[#6b7280]">
            Cargando…
          </p>
          <ul v-else-if="filtered.length" class="space-y-2">
            <li
              v-for="c in filtered"
              :key="String(c.id)"
            >
              <button
                type="button"
                class="flex w-full flex-col gap-0.5 rounded-lg border px-3 py-3 text-left transition"
                :class="
                  selectedAccountId === String(c.id)
                    ? 'border-[#95e8df] bg-[#e8f7f5]'
                    : 'border-[#e6e8ee] bg-white hover:border-[#cfd6e6]'
                "
                @click="pick(c)"
              >
                <span class="text-[14px] font-semibold text-[#0a1325]">{{ c.alias || 'Sin alias' }}</span>
                <span class="font-mono text-[13px] text-[#5c6578]">{{ maskNum(c.numeroCuenta as string | undefined) }}</span>
              </button>
            </li>
          </ul>
          <p v-else class="py-6 text-center text-[14px] text-[#6b7280]">
            No tienes cuentas en esta moneda.
          </p>

          <button
            type="button"
            class="mt-4 flex w-full items-center gap-3 rounded-lg border border-dashed border-[#b8c0d0] bg-[#f8fafc] px-3 py-3 text-left transition hover:bg-[#f1f5f9]"
            @click="emit('add')"
          >
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-[#d0d7e2] bg-white text-xl font-light text-[#1a253f]">
              +
            </span>
            <span class="text-[14px] font-semibold text-[#1a253f]">Agregar cuenta</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
