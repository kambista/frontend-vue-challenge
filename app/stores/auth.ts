import { defineStore } from 'pinia'
import type { AuthSessionData, AuthUser, LoginPayload, RegisterPayload } from '~/composables/useAuthApi'
import { getApiErrorMessage } from '~/composables/useAuthApi'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = useCookie<string | null>('access_token', { default: () => null })
  const refreshToken = useCookie<string | null>('refresh_token', { default: () => null })
  const user = useCookie<AuthUser | null>('auth_user', { default: () => null })
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value)
  const { login: loginApi, register: registerApi, refresh: refreshApi, logout: logoutApi, me: meApi } = useAuthApi()

  function setSession(session: AuthSessionData) {
    accessToken.value = session.accessToken
    refreshToken.value = session.refreshToken
    user.value = session.user
  }

  function clearSession() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    error.value = null
  }

  async function login(credentials: LoginPayload) {
    isLoading.value = true
    error.value = null
    try {
      const session = await loginApi(credentials)
      setSession(session)
    }
    catch (err) {
      error.value = getApiErrorMessage(err)
    }
    finally {
      isLoading.value = false
    }
  }

  async function register(payload: RegisterPayload): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      const session = await registerApi(payload)
      setSession(session)
      return true
    }
    catch (err) {
      error.value = getApiErrorMessage(err)
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  async function refreshSession() {
    if (!refreshToken.value)
      throw new Error('INVALID_REFRESH_TOKEN')

    const session = await refreshApi(refreshToken.value)
    setSession(session)
  }

  async function fetchMe() {
    const profile = await meApi()
    user.value = profile
    return profile
  }

  async function logout() {
    const previousToken = refreshToken.value
    clearSession()
    if (!previousToken)
      return

    try {
      await logoutApi(previousToken)
    }
    catch {
      // Si el refresh token ya no es valido, mantenemos sesion local cerrada.
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    accessToken,
    refreshToken,
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    refreshSession,
    fetchMe,
    clearSession,
    clearError,
  }
})
