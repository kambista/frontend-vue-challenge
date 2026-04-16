type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface ApiEnvelopeSuccess<T> {
  success: true
  data: T
}

interface ApiErrorPayload {
  name?: string
  title?: string
  message?: string
}

interface ApiEnvelopeFailure {
  success: false
  data?: ApiErrorPayload
}

type ApiEnvelope<T> = ApiEnvelopeSuccess<T> | ApiEnvelopeFailure

export interface ApiClientError {
  statusCode: number
  name: string
  title: string
  message: string
}

export interface ApiRequestOptions {
  method?: HttpMethod
  query?: Record<string, string | number | boolean | null | undefined>
  body?: unknown
  headers?: Record<string, string>
  auth?: boolean
}

let pendingRefresh: Promise<void> | null = null

function parseApiError(rawError: any): ApiClientError {
  const statusCode = Number(rawError?.status || rawError?.statusCode || 500)
  const envelope = rawError?.data as ApiEnvelopeFailure | undefined
  const data = envelope?.data
  return {
    statusCode,
    name: data?.name ?? 'REQUEST_ERROR',
    title: data?.title ?? 'Error',
    message: data?.message ?? 'No se pudo completar la solicitud.',
  }
}

function shouldRefresh(error: ApiClientError) {
  return error.statusCode === 401 && error.name === 'INVALID_ACCESS_TOKEN'
}

export function useApi() {
  const config = useRuntimeConfig()
  const normalizedBaseUrl = String(config.public.apiBase || '').replace(/\/+$/, '')

  async function rawRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const auth = useAuthStore()
    const authHeaders: Record<string, string> = {}
    const requiresAuth = options.auth ?? true
    const token = auth.accessToken

    if (requiresAuth && token)
      authHeaders.Authorization = `Bearer ${token}`

    const response = await $fetch<ApiEnvelope<T>>(path, {
      baseURL: normalizedBaseUrl,
      method: options.method ?? 'GET',
      query: options.query,
      body: options.body as any,
      headers: {
        ...options.headers,
        ...authHeaders,
      },
    })

    if (!response.success) {
      const info = response.data
      throw createError({
        statusCode: 400,
        statusMessage: info?.title ?? 'Error de validación',
        data: {
          success: false,
          data: {
            name: info?.name ?? 'REQUEST_ERROR',
            title: info?.title ?? 'Error de validación',
            message: info?.message ?? 'No se pudo completar la solicitud.',
          },
        },
      })
    }

    return response.data
  }

  async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    try {
      return await rawRequest<T>(path, options)
    }
    catch (rawError) {
      const parsedError = parseApiError(rawError)
      const requiresAuth = options.auth ?? true
      if (!requiresAuth || !shouldRefresh(parsedError))
        throw parsedError

      const auth = useAuthStore()
      if (!auth.refreshToken) {
        auth.clearSession()
        throw parsedError
      }

      if (!pendingRefresh) {
        pendingRefresh = auth.refreshSession()
          .finally(() => {
            pendingRefresh = null
          })
      }

      try {
        await pendingRefresh
      }
      catch {
        auth.clearSession()
        throw parsedError
      }

      return await rawRequest<T>(path, options)
    }
  }

  return { request }
}
