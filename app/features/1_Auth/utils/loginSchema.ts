import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export const loginSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .nonempty('El correo es obligatorio')
      .email('Ingresa un correo válido'),
    password: z
      .string()
      .nonempty('La contraseña es obligatoria')
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  })
)