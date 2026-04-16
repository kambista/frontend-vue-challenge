export type Currency = 'USD' | 'PEN'
export type OperationType = 'compra' | 'venta'

export type BankName =
  | 'BCP'
  | 'Interbank'
  | 'BBVA'
  | 'BanBif'
  | 'Scotiabank'
  | 'Falabella'
  | 'Pichincha'
  | 'Bancomercio'
  | 'Citibank'
  | 'Mibanco'
  | 'GNB'
  | 'Ripley'
  | 'Nacion'
  | 'Otro'

export type FundSource =
  | 'Ahorros'
  | 'Donación/Sorteo'
  | 'Venta de bien mueble'
  | 'Venta de bien inmueble'
  | 'Herencia'
  | 'Préstamos'

export interface BankOption {
  id: string
  name: string
  alias: string
}

export interface FundSourceOption {
  _id: string
  name: string
}

export interface KambistaBankAccount {
  bank: string
  accountNumber: string
  ruc: string
  holder: string
  accountType: string
}

export interface OperationData {
  sendAmount: number
  receiveAmount: number
  sendCurrency: Currency
  receiveCurrency: Currency
  currentRate: number
  previousRate: number
  coupon: string | null
  fromBank: BankName | null
  toBank: string | null
  fundSource: FundSource | null
  operationType: OperationType
}

export interface SelectOption {
  value: string
  label: string
}

export interface APIError {
  success: false
  data: {
    name: 'DUPLICATE_DNI' | 'INVALID_PHONE' | 'SERVER_ERROR' | string
    title: string
    message: string
  }
}
