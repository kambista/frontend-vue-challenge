import { useOperationStore } from '~/stores/operation'

export function useOperationFlow() {
  const store = useOperationStore()
  const router = useRouter()

  function goToStep(step: 1 | 2 | 3) {
    const routes: Record<number, string> = {
      1: '/operacion/completa',
      2: '/operacion/transfiere',
      3: '/operacion/constancia',
    }
    store.setStep(step)
    router.push(routes[step])
  }

  function goBack() {
    if (store.currentStep > 1) {
      goToStep((store.currentStep - 1) as 1 | 2)
    } else {
      router.push('/')
    }
  }

  return { goToStep, goBack }
}
