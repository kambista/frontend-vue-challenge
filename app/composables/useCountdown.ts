export function useCountdown(targetTime: string) {
  // targetTime formato "HH:MM"
  const timeLeft = ref('')

  const interval = setInterval(() => {
    const now = new Date()
    const [hh, mm] = targetTime.split(':').map(Number)
    const target = new Date()
    target.setHours(hh, mm, 0, 0)
    const diff = target.getTime() - now.getTime()
    if (diff <= 0) {
      clearInterval(interval)
      timeLeft.value = '00:00'
      return
    }
    const m = Math.floor(diff / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    timeLeft.value = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }, 1000)

  onUnmounted(() => clearInterval(interval))

  return { timeLeft }
}
