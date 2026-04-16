export function useClipboard() {
  const copiedKey = ref<string | null>(null)

  async function copyToClipboard(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text)
      copiedKey.value = key
      setTimeout(() => {
        copiedKey.value = null
      }, 2000)
    } catch {
      console.error('Error al copiar al portapapeles')
    }
  }

  const isCopied = (key: string) => computed(() => copiedKey.value === key)

  return { copyToClipboard, isCopied, copiedKey }
}
