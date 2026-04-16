import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export const registerSchema = toTypedSchema(
  z.object({
    email: z.string().nonempty('El correo es obligatorio').email('Ingresa un correo válido'),
    confirmEmail: z.string().nonempty('Debes confirmar tu correo'),
    password: z.string().nonempty('La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string().nonempty('Debes confirmar tu contraseña'),
    acceptTerms: z.boolean().refine(val => val === true, 'Debes aceptar los términos y condiciones'),
    acceptPrivacy: z.boolean().refine(val => val === true, 'Debes aceptar la política de privacidad'),
    acceptPromotions: z.boolean().optional()
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: 'Los correos no coinciden',
    path: ['confirmEmail']
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  })
)