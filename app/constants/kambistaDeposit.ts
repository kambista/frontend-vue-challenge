/** Ventana de validez mostrada para la cotización en el paso «Transfiere». */
export const QUOTE_VALIDITY_MS = 15 * 60 * 1000

/** Datos de la cuenta de depósito de Kambista (mock). */
export const KAMBISTA_DEPOSIT = {
  accountNumber: '201010000000000',
  ruc: '20601708141',
  accountHolder: 'Kambista SAC',
  accountType: 'Corriente',
} as const

/** Coloca tu PNG/WebP en `public/images/` con este nombre. */
export const TRANSACTION_TRANSFER_ILLUSTRATION_SRC = '/images/transaction-transfer-illustration.png'

/** Ilustración del paso «Envía constancia» (`public/images/`). */
export const TRANSACTION_CONSTANCIA_ILLUSTRATION_SRC = '/images/transaction-constancia-illustration.png'

/** Ilustración pantalla «Constancia enviada» (`public/images/`). */
export const TRANSACTION_SUCCESS_ILLUSTRATION_SRC = '/images/logo_cerdito.png'
