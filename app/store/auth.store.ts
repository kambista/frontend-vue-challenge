import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<Record<string, any> | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref<boolean>(false)

  const isAuthenticated = computed(() => !!token.value)

  const userFirstName = computed(() => {
    if (!user.value?.fullName) return 'Usuario'
    return user.value.fullName.split(' ')[0]
  })
  
  const userPersonalData = computed(() => user.value)
  
  const login = async (credentials: any) => {
    isLoading.value = true
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        isLoading.value = false
        
        // SIMULADOR DE VALIDACIÓN
        const validEmail = user.value?.email || 'test@kambista.com'
        if (credentials.email !== validEmail || credentials.password !== '123456') {
          reject({
            success: false,
            data: {
              name: "INVALID_CREDENTIALS",
              message: "Correo o contraseña incorrectos."
            }
          })
          return
        }

        token.value = 'kambista_simulated_token_xyz'
        
        if (!user.value) {
          user.value = { fullName: 'Test Kambista', email: credentials.email }
        }
        
        resolve(true)
      }, 1200)
    })
  }

  const submitPersonalData = async (personalData: any) => {
    isLoading.value = true
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        isLoading.value = false
        
        if (personalData.documentNumber === '12345678') {
          reject({
            success: false,
            data: {
              name: "DUPLICATE_DNI",
              title: "DNI en uso",
              message: "El número de documento registrado ya está en uso."
            }
          })
          return
        }

        user.value = { ...personalData }
        token.value = 'kambista_simulated_token_new_user'
        resolve(true)
      }, 1500)
    })
  }

  const logout = () => {
    user.value = null
    token.value = null
  }

  return { 
    user, 
    userPersonalData,
    token, 
    isLoading, 
    isAuthenticated, 
    userFirstName, 
    login, 
    submitPersonalData, 
    logout 
  }
})