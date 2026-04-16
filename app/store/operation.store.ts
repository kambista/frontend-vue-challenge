import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOperationStore = defineStore('operation', () => {
  const sendAmount = ref('0.00')
  const sendCurrency = ref('Dólares')
  const receiveAmount = ref('0.00')
  const receiveCurrency = ref('Soles')
  const rateCompra = ref(3.321)
  const rateVenta = ref(3.350)
  
  const selectedOriginBank = ref('')
  const selectedDestinationAccount = ref('')
  const selectedSourceFund = ref('')

  const setCalculatorData = (data: {
    sendAmount: string
    sendCurrency: string
    receiveAmount: string
    receiveCurrency: string
    rateCompra: number
    rateVenta: number
  }) => {
    sendAmount.value = data.sendAmount
    sendCurrency.value = data.sendCurrency
    receiveAmount.value = data.receiveAmount
    receiveCurrency.value = data.receiveCurrency
    rateCompra.value = data.rateCompra
    rateVenta.value = data.rateVenta
  }

  const resetOperation = () => {
    sendAmount.value = '0.00'
    receiveAmount.value = '0.00'
    selectedOriginBank.value = ''
    selectedDestinationAccount.value = ''
    selectedSourceFund.value = ''
  }

  return {
    sendAmount,
    sendCurrency,
    receiveAmount,
    receiveCurrency,
    rateCompra,
    rateVenta,
    selectedOriginBank,
    selectedDestinationAccount,
    selectedSourceFund,
    setCalculatorData,
    resetOperation
  }
})