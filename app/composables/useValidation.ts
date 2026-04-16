import type { RegisterPayload } from '~/composables/useAuthApi'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** Letras Unicode y espacios; sin números ni otros símbolos */
const FULL_NAME_RE = /^[\p{L}]+(?:\s+[\p{L}]+)*$/u

export type TipoDocumentoForm = '' | RegisterPayload['tipoDocumento']

export function useValidation() {
  function validateEmail(value: string): string | null {
    const v = value.trim()
    if (!v)
      return 'El correo es obligatorio'
    if (!EMAIL_RE.test(v))
      return 'Introduce un correo electrónico válido'
    return null
  }

  function validatePassword(value: string): string | null {
    if (!value)
      return 'La contraseña es obligatoria'
    if (value.length < 8)
      return 'La contraseña debe tener al menos 8 caracteres'
    return null
  }

  function validateFullName(value: string): string | null {
    const v = value.trim()
    if (!v)
      return 'El nombre es obligatorio'
    if (!FULL_NAME_RE.test(v))
      return 'Usa solo letras y espacios (sin números ni caracteres especiales)'
    return null
  }

  function validateDocumentType(tipo: TipoDocumentoForm): string | null {
    if (!tipo)
      return 'Selecciona el tipo de documento'
    return null
  }

  function validateDocumentNumber(tipo: TipoDocumentoForm, value: string): string | null {
    const v = value.trim()
    if (!tipo)
      return null
    if (!v)
      return 'El número de documento es obligatorio'
    if (tipo === 'dni') {
      if (!/^\d{8}$/.test(v))
        return 'El DNI debe tener 8 dígitos'
      return null
    }
    if (tipo === 'cce') {
      if (!/^\d{9}$/.test(v))
        return 'El CE debe tener 9 dígitos'
      return null
    }
    if (tipo === 'pasaporte') {
      if (!/^[A-Za-z0-9]{8,15}$/.test(v))
        return 'El pasaporte debe tener entre 8 y 15 caracteres alfanuméricos'
      return null
    }
    return null
  }

  function validatePhone(value: string): string | null {
    const v = value.trim().replace(/\s/g, '')
    if (!v)
      return 'El celular es obligatorio'
    if (!/^\d{9}$/.test(v))
      return 'El celular debe tener 9 dígitos'
    return null
  }

  function parseBirthDateDdMmYyyy(s: string): Date | null {
    const m = s.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (!m)
      return null
    const dd = Number(m[1])
    const mm = Number(m[2]) - 1
    const yyyy = Number(m[3])
    const d = new Date(yyyy, mm, dd)
    if (d.getDate() !== dd || d.getMonth() !== mm || d.getFullYear() !== yyyy)
      return null
    return d
  }

  function validateBirthDate(value: string): string | null {
    const v = value.trim()
    if (!v)
      return 'La fecha de nacimiento es obligatoria'
    const d = parseBirthDateDdMmYyyy(v)
    if (!d)
      return 'Usa el formato DD/MM/AAAA con una fecha válida'
    const today = new Date()
    let age = today.getFullYear() - d.getFullYear()
    const md = today.getMonth() - d.getMonth()
    if (md < 0 || (md === 0 && today.getDate() < d.getDate()))
      age--
    if (age < 18)
      return 'Debes ser mayor de edad para registrarte'
    if (age > 120)
      return 'Verifica la fecha de nacimiento'
    return null
  }

  function validateBankAccountNumber(value: string): string | null {
    const v = value.trim().replace(/\s/g, '')
    if (!v)
      return 'El número de cuenta es obligatorio'
    if (!/^\d+$/.test(v))
      return 'Solo se permiten dígitos'
    if (v.length < 6 || v.length > 22)
      return 'Verifica la longitud del número de cuenta'
    return null
  }

  function validateAccountAlias(value: string): string | null {
    const v = value.trim()
    if (!v)
      return 'El alias es obligatorio'
    if (v.length < 2)
      return 'El alias debe tener al menos 2 caracteres'
    return null
  }

  function birthDateToIso(value: string): string | null {
    const d = parseBirthDateDdMmYyyy(value)
    if (!d)
      return null
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  return {
    validateEmail,
    validatePassword,
    validateFullName,
    validateDocumentType,
    validateDocumentNumber,
    validatePhone,
    validateBirthDate,
    parseBirthDateDdMmYyyy,
    birthDateToIso,
    validateBankAccountNumber,
    validateAccountAlias,
  }
}
