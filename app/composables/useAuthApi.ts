import type { ApiClientError } from '~/composables/useApi'

export interface AuthUser {
  id: number
  email: string
  nombresCompletos: string
  tipoDocumento: 'dni' | 'cce' | 'pasaporte'
  numeroDocumento: string
  celular: string
  fechaNacimiento: string
}

export interface AuthSessionData {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

export interface RegisterPayload {
  email: string
  password: string
  nombresCompletos: string
  tipoDocumento: 'dni' | 'cce' | 'pasaporte'
  numeroDocumento: string
  celular: string
  fechaNacimiento: string
}

export interface LoginPayload {
  email: string
  password: string
}

export function useAuthApi() {
  const { request } = useApi()

  const register = (payload: RegisterPayload) =>
    request<AuthSessionData>('/auth/register', {
      method: 'POST',
      body: payload,
      auth: false,
    })

  const login = (payload: LoginPayload) =>
    request<AuthSessionData>('/auth/login', {
      method: 'POST',
      body: payload,
      auth: false,
    })

  const refresh = (refreshToken: string) =>
    request<AuthSessionData>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
      auth: false,
    })

  const logout = (refreshToken: string) =>
    request<{ ok: true }>('/auth/logout', {
      method: 'POST',
      body: { refreshToken },
      auth: false,
    })

  const me = () =>
    request<AuthUser>('/auth/me', {
      method: 'GET',
      auth: true,
    })

  return {
    register,
    login,
    refresh,
    logout,
    me,
  }
}

export function getApiErrorMessage(error: unknown): string {
  const apiError = error as Partial<ApiClientError> | undefined
  if (!apiError?.name)
    return 'No se pudo completar la solicitud. Intenta nuevamente.'

  const knownMessages: Record<string, string> = {
    INVALID_CREDENTIALS: 'Correo o contraseña incorrectos.',
    UNAUTHORIZED: 'Tu sesión no es válida. Inicia sesión nuevamente.',
    INVALID_ACCESS_TOKEN: 'Tu sesión expiró. Intenta nuevamente.',
    INVALID_REFRESH_TOKEN: 'Tu sesión expiró. Inicia sesión nuevamente.',
    VALIDATION_ERROR: apiError.message ?? 'Verifica los datos enviados.',
    DUPLICATE: apiError.message ?? 'El correo o documento ya está registrado.',
    NOT_FOUND: apiError.message ?? 'No se encontró el recurso solicitado.',
  }

  return knownMessages[apiError.name] ?? apiError.message ?? 'Ocurrió un error inesperado.'
}
