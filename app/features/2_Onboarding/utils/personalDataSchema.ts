import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export const personalDataSchema = toTypedSchema(
  z.object({
    fullName: z.string().nonempty('Tus nombres completos son obligatorios'),
    documentType: z.string().nonempty('Requerido'),
    documentNumber: z.string()
      .nonempty('El número de documento es obligatorio')
      .min(8, 'Mínimo 8 dígitos')
      .max(12, 'Máximo 12 dígitos'),
    phone: z.string()
      .nonempty('El celular es obligatorio')
      .min(9, 'Debe tener al menos 9 dígitos'),
    birthDate: z.string().nonempty('La fecha de nacimiento es obligatoria'),
    acceptTerms: z.boolean().refine(val => val === true, 'Debes aceptar los términos'),
    acceptPrivacy: z.boolean().refine(val => val === true, 'Debes aceptar la política')
  })
)