<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string
    label: string
    type?: 'text' | 'email' | 'password'
    variant?: 'default' | 'amount'
    error?: string | null
    placeholder?: string
    id?: string
    autocomplete?: string
    inputmode?: 'text' | 'none' | 'email' | 'decimal' | 'search' | 'tel' | 'url' | 'numeric'
    disabled?: boolean
    showPasswordToggle?: boolean
  }>(),
  {
    type: 'text',
    variant: 'default',
    error: null,
    placeholder: '',
    autocomplete: 'off',
    disabled: false,
    showPasswordToggle: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const showPassword = ref(false)

const isAmount = computed(() => props.variant === 'amount')

const model = computed({
  get: () => props.modelValue,
  set: (v: string) => emit('update:modelValue', v),
})

const effectiveType = computed(() => {
  if (isAmount.value)
    return 'text'
  if (props.type === 'password' && props.showPasswordToggle && showPassword.value)
    return 'text'
  return props.type
})

const rootClass = computed(() =>
  isAmount.value ? 'w-full' : 'w-full max-w-md',
)

const labelClass = computed(() =>
  isAmount.value
    ? 'block text-xs font-semibold text-[#1a253f] sm:text-[13px]'
    : 'mb-1.5 block text-sm font-medium text-slate-500',
)

const inputClass = computed(() => {
  if (isAmount.value) {
    return 'mt-1 w-full min-w-0 border-0 bg-transparent p-0 text-2xl font-bold leading-tight text-[#0a1325] outline-none ring-0 placeholder:text-slate-400 focus:ring-0 sm:text-[26px] xl:text-[30px] disabled:opacity-60'
  }
  return 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 disabled:opacity-60'
})

const showPasswordBtn = computed(
  () => !isAmount.value && props.type === 'password' && props.showPasswordToggle,
)

function togglePassword() {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div :class="rootClass">
    <label
      :for="inputId"
      :class="labelClass"
    >{{ label }}</label>
    <div class="relative">
      <input
        :id="inputId"
        v-model="model"
        :type="effectiveType"
        :inputmode="inputmode"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :class="[inputClass, showPasswordBtn ? 'pr-11' : '']"
        :aria-invalid="error ? 'true' : 'false'"
        :aria-describedby="error ? `${inputId}-err` : undefined"
        @blur="emit('blur')"
      >
      <button
        v-if="showPasswordBtn"
        type="button"
        class="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        :aria-pressed="showPassword"
        @click="togglePassword"
      >
        <span v-if="!showPassword" class="block h-5 w-5" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </span>
        <span v-else class="block h-5 w-5" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
        </span>
      </button>
    </div>
    <p
      v-if="error"
      :id="`${inputId}-err`"
      class="mt-1 text-sm text-red-600"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>
