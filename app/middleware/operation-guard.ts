import { useOperationStore } from '~/stores/operation'

export default defineNuxtRouteMiddleware((to) => {
  const store = useOperationStore()

  // Si la operación ya está completada (step 3), la constancia es el estado terminal.
  // Redirigir cualquier intento de volver a pasos anteriores.
  if (store.currentStep === 3 && to.path !== '/operacion/constancia') {
    return navigateTo('/operacion/constancia', { replace: true })
  }

  const stepRoutes: Record<string, number> = {
    '/operacion/transfiere': 1,
    '/operacion/constancia': 2,
  }

  const requiredStep = stepRoutes[to.path]
  if (requiredStep !== undefined && store.currentStep < requiredStep) {
    return navigateTo('/dashboard')
  }
})
