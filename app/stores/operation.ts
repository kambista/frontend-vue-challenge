import { defineStore } from 'pinia'
import type { OperationData, BankName, KambistaBankAccount } from '~/types/operation'

export const useOperationStore = defineStore('operation', () => {
  // ── Estado ──────────────────────────────────
  const currentStep = ref<1 | 2 | 3>(1)

  const userKoinks = ref(2500)

  // Indica si el usuario ya completó el onboarding (bienvenido)
  const hasCompletedOnboarding = ref(false)

  // Datos del usuario logueado
  const userEmail = ref('')
  const userName = ref('')

  const operationData = ref<OperationData>({
    sendAmount: 100,
    receiveAmount: 0,
    sendCurrency: 'USD',
    receiveCurrency: 'PEN',
    currentRate: 0,
    previousRate: 0,
    coupon: null,
    fromBank: null,
    toBank: null,
    fundSource: null,
    operationType: 'compra',
  })

  // ── Cálculo de Koinks ─────────────────────────
  // Fórmula: 1 USD = 10 Koinks o equivalente en Soles
  const earnedKoinks = computed(() => {
    const amountInUsd = operationData.value.sendCurrency === 'USD' 
      ? operationData.value.sendAmount 
      : (operationData.value.sendAmount / (operationData.value.currentRate || 3.7))
    return Math.floor(amountInUsd * 10)
  })

  // ── Cuentas bancarias de Kambista por banco ──
  const bankAccounts: Partial<Record<string, KambistaBankAccount>> = {
    BCP: {
      bank: 'BCP - Banco de Crédito del Perú',
      accountNumber: '1912452167062',
      ruc: '20601708141',
      holder: 'Kambista SAC',
      accountType: 'Cuenta Corriente - Soles',
    },
    Interbank: {
      bank: 'Interbank',
      accountNumber: '201010000000000',
      ruc: '20601708141',
      holder: 'Kambista SAC',
      accountType: 'Corriente',
    },
    Scotiabank: {
      bank: 'Scotiabank',
      accountNumber: '0074589621',
      ruc: '20601708141',
      holder: 'Kambista SAC',
      accountType: 'Cuenta Corriente - Soles',
    },
    BBVA: {
      bank: 'BBVA Continental',
      accountNumber: '0011-0175-0100063831',
      ruc: '20601708141',
      holder: 'Kambista SAC',
      accountType: 'Cuenta Corriente - Soles',
    },
    Falabella: {
      bank: 'Banco Falabella',
      accountNumber: '5710131825',
      ruc: '20601708141',
      holder: 'Kambista SAC',
      accountType: 'Cuenta Corriente - Soles',
    },
    BanBif: {
      bank: 'BanBif',
      accountNumber: '010-100-001820-5',
      ruc: '20601708141',
      holder: 'Kambista SAC',
      accountType: 'Cuenta Corriente - Soles',
    },
    Pichincha: {
      bank: 'Banco Pichincha',
      accountNumber: '2100326685',
      ruc: '20601708141',
      holder: 'Kambista SAC',
      accountType: 'Cuenta Corriente - Soles',
    },
  }

  // ── Getters ──────────────────────────────────
  const selectedBankAccount = computed<KambistaBankAccount | null>(() =>
    operationData.value.fromBank
      ? (bankAccounts[operationData.value.fromBank] ?? null)
      : null,
  )

  const isStep1Complete = computed(() =>
    !!operationData.value.fromBank
    && !!operationData.value.toBank
    && !!operationData.value.fundSource,
  )

  // ── Acciones ─────────────────────────────────
  function setStep(step: 1 | 2 | 3) {
    currentStep.value = step
  }

  function updateOperation(partial: Partial<OperationData>) {
    operationData.value = { ...operationData.value, ...partial }
  }

  function resetOperation() {
    operationData.value = {
      sendAmount: 0,
      receiveAmount: 0,
      sendCurrency: 'USD',
      receiveCurrency: 'PEN',
      currentRate: 0,
      previousRate: 0,
      coupon: null,
      fromBank: null,
      toBank: null,
      fundSource: null,
      operationType: 'compra',
    }
    currentStep.value = 1
  }

  function completeOnboarding() {
    hasCompletedOnboarding.value = true
  }

  // ── LocalStorage para cuentas ──────────────────
  function saveAccountToLocalStorage(account: any) {
    if (typeof window === 'undefined') return
    
    try {
      const saved = localStorage.getItem('savedSolesAccounts')
      const accounts = saved ? JSON.parse(saved) : []
      
      // Evitar duplicados por número de cuenta
      const exists = accounts.some((a: any) => a.number === account.number)
      if (!exists) {
        accounts.unshift(account)
        localStorage.setItem('savedSolesAccounts', JSON.stringify(accounts))
      }
    } catch (error) {
      console.error('Error saving account to localStorage:', error)
    }
  }

  function getSavedAccountsFromLocalStorage() {
    if (typeof window === 'undefined') return []
    
    try {
      const saved = localStorage.getItem('savedSolesAccounts')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Error reading accounts from localStorage:', error)
      return []
    }
  }

  function clearSavedAccounts() {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem('savedSolesAccounts')
    } catch (error) {
      console.error('Error clearing accounts from localStorage:', error)
    }
  }

  // ── User auth data management ────────────────
  function setUserData(email: string) {
    if (typeof window === 'undefined') return
    
    userEmail.value = email
    // Extraer nombre del email (parte antes del @)
    const namePart = email.split('@')[0] || 'Usuario'
    userName.value = namePart
    
    // Resetear onboarding flag para nuevas sesiones de login
    hasCompletedOnboarding.value = false
    
    // Guardar en localStorage
    try {
      localStorage.setItem('kambista_user_email', email)
    } catch (error) {
      console.error('Error saving user data to localStorage:', error)
    }
  }

  function loadUserData() {
    if (typeof window === 'undefined') return
    
    try {
      const savedEmail = localStorage.getItem('kambista_user_email')
      if (savedEmail) {
        userEmail.value = savedEmail
        const namePart = savedEmail.split('@')[0] || 'Usuario'
        userName.value = namePart
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error)
    }
  }

  function logout() {
    if (typeof window === 'undefined') return
    
    // Limpiar datos del usuario
    userEmail.value = ''
    userName.value = ''
    
    // Limpiar localStorage
    try {
      localStorage.removeItem('kambista_user_email')
      localStorage.removeItem('savedSolesAccounts')
    } catch (error) {
      console.error('Error clearing user data from localStorage:', error)
    }
  }

  return {
    currentStep,
    operationData,
    bankAccounts,
    selectedBankAccount,
    userKoinks,
    earnedKoinks,
    hasCompletedOnboarding,
    isStep1Complete,
    userEmail,
    userName,
    setStep,
    updateOperation,
    resetOperation,
    completeOnboarding,
    saveAccountToLocalStorage,
    getSavedAccountsFromLocalStorage,
    clearSavedAccounts,
    setUserData,
    loadUserData,
    logout,
  }
})
