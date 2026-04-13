import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export const personalDataSchema = toTypedSchema(
  z.object({
    fullName: z.string()
      .min(1, 'Tus nombres completos son obligatorios')
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras, sin números ni caracteres especiales'),
    
    documentType: z.string().min(1, 'Requerido'),
    documentNumber: z.string().min(1, 'El número de documento es obligatorio'),
    
    phone: z.string()
      .min(1, 'El celular es obligatorio')
      .regex(/^9\d{8}$/, 'Debe empezar con 9 y tener exactamente 9 números'),
    
    birthDate: z.string()
      .min(1, 'La fecha de nacimiento es obligatoria')
      .refine((val) => {
        let isoDate = val;
        if (val.includes('/') || val.indexOf('-') === 2) {
          const sep = val.includes('/') ? '/' : '-';
          const [day, month, year] = val.split(sep);
          isoDate = `${year}-${month}-${day}`;
        }
        const birthDate = new Date(`${isoDate}T00:00:00`);

        if (isNaN(birthDate.getTime())) return false;

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        return age >= 18;
      }, 'Debes ser mayor de 18 años para registrarte'),
    
    acceptTerms: z.boolean().refine(val => val === true, 'Debes aceptar los términos'),
    acceptPrivacy: z.boolean().refine(val => val === true, 'Debes aceptar la política')
  })
  
  .superRefine((data, ctx) => {
    
    if (data.documentType === 'DNI') {
      if (!/^\d{8}$/.test(data.documentNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El DNI debe tener exactamente 8 números',
          path: ['documentNumber']
        })
      }
    } 
    
    else if (data.documentType === 'CE') {
      if (!/^\d{9}$/.test(data.documentNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El CE debe tener exactamente 9 números',
          path: ['documentNumber']
        })
      }
    } 
    
    else if (data.documentType === 'PASSPORT') {
      if (!/^[a-zA-Z0-9]{8,15}$/.test(data.documentNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El Pasaporte debe tener entre 8 y 15 caracteres',
          path: ['documentNumber']
        })
      }
    }
    
  })
)