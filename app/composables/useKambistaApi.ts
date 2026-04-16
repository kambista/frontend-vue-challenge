interface ExchangeCurrentResponse {
  ask: number
  bid: number
}

export interface BankItem {
  id: number | string
  name: string
  alias: string
}

export interface SourceFundItem {
  id: number | string
  name: string
}

export type ExchangeCalculationQuery = Record<string, string | number | boolean | null | undefined> & {
  originCurrency: string
  destinationCurrency: string
  amount: number
  active?: string
}

export interface ExchangeTc {
  bid?: number
  ask?: number
}

export interface ExchangeCalculateResponse {
  rate?: number
  exchange?: number
  tc?: ExchangeTc
  data?: { operate?: boolean; msg?: string }
  savings?: { amount?: string; currency?: string }
  originAmount?: number
  destinationAmount?: number
  amountOrigin?: number
  amountDestination?: number
  exchangeRate?: number
  tipoCambio?: number
  [key: string]: unknown
}

export interface UserAccountPayload {
  userId: number
  entidadId: number
  tipoCuenta: string
  numeroCuenta: string
  moneda: 'PEN' | 'USD'
  alias: string
  esPropietario?: boolean
}

export interface UserCuenta {
  id: number | string
  userId?: number
  entidadId?: number
  tipoCuenta?: string
  numeroCuenta?: string
  moneda?: string
  alias?: string
  esPropietario?: boolean
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

export function useKambistaApi() {
  const { request } = useApi()

  const getCurrentExchange = () =>
    request<ExchangeCurrentResponse>('/exchange/current', {
      method: 'GET',
      auth: true,
    })

  const calculateExchange = (query: ExchangeCalculationQuery) =>
    request<ExchangeCalculateResponse>('/exchange/calculate', {
      method: 'GET',
      query: {
        ...query,
        amount: Number(query.amount),
      },
      auth: true,
    })

  const getBanks = () =>
    request<BankItem[]>('/banks', {
      method: 'GET',
      auth: true,
    })

  const getSourceFunds = () =>
    request<SourceFundItem[]>('/source-funds', {
      method: 'GET',
      auth: true,
    })

  const getUserAccounts = (userId: number) =>
    request<UserCuenta[]>('/cuentas-usuario', {
      method: 'GET',
      query: { userId },
      auth: true,
    })

  const createUserAccount = (payload: UserAccountPayload) =>
    request<UserCuenta>('/cuentas-usuario', {
      method: 'POST',
      body: payload,
      auth: true,
    })

  return {
    getCurrentExchange,
    calculateExchange,
    getBanks,
    getSourceFunds,
    getUserAccounts,
    createUserAccount,
  }
}
