# Kambista Frontend developer!

👋 Somos [Kambista](https://kambista.com) y estamos en la búsqueda de un nuevo miembro para nuestro equipo de tech que nos ayude a seguir ofreciendo la mejor experiencia de cambio, para esto hemos preparado un reto técnico el cual pueden completar y enviarnos el resultado con las instrucciones de entrega.

## Caso

Se necesita desarrollar una aplicación de intercambio de divisas, siguiendo el diseño proporcionado en este [Figma](https://www.figma.com/design/CkUU2J5WZNACGQVy3vFr45/Untitled?node-id=0-1&p=f&t=3p9NiX4qWDMnL8g9-0).

## Tecnologías

Para el desarrollo de la solución se debe utilizar las siguientes tecnologías:

- Nuxt 4 con Typescript.
- Estilos personalizados con [tailwindcss](https://tailwindcss.com/)
- Manejo de estado con Pinia

## 📝 Requerimientos funcionales

### I. Módulo de Autenticación

**Login**: Formulario para el inicio de sesión de los usuarios con validación de campos en tiempo real.

### II: Módulo de Onboarding

1: **Datos personales**: Formulario para completar los datos personales del usuario con
validación de campos en tiempo real.

Manejo de errores específicos (ej: DNI duplicado)

```
// Ejemplo de error en servicio
{
   "success": false,
   "data": {
      "name": "DUPLICATE_DNI",
      "title": "DNI en uso",
      "message": "El número de documento registrado ya está en uso."
   }
}
```

2: **Registro exitoso**: Vista para indicar que todos los datos se han registrado exitosamente.

### II: Módulo de Transacciones

1: **Pantalla principal**: Es la vista inicial donde se muestra la calculadora de cotización del cambio y se inicia la operación con:

- Consumo de API para obtener datos de tipo de cambio.
- Consumo de API para calcular una operación.
- Cálculos en tiempo real.

2: **Agregar información adicional del cambio**:

- En esta vista por una parte se deben seleccionar los bancos que se usarán para el intercambio de divisas y el origen de fondos de acuerdo a mock anexo.
- Por otra parte se debe agregar la cuenta de destino con:
  Selector de banco (usar mock proporcionado)
  Tipo de cuenta (ahorro/crédito)
  Número de cuenta (validación: solo dígitos)
  Validación de campos en tiempo real

> \*Ver listado de bancos a agregar en mock anexo.

3: **Datos de transferencia**: Vista con los datos de la cuenta bancaria de Kambista.

4: **Adjuntar voucher de depósito**: Vista de formulario para adjuntar voucher bancario del depósito efectuado.

5: **Transacción creada**: Vista de resumen de la operación creada.

## Información adicional

-**APIs a utilizar**

1. Endpoint para obtener el tipo de cambio:

```
https://api.kambista.com/v1/exchange/kambista/current
```

2. Endpoint para la calculadora:

```
https://api.kambista.com/v1/exchange/calculates?originCurrency=PEN&destinationCurrency=USD&amount={cantidad}&active=S
```

-**Mocks de data adicional**
Se incluyen dos archivos JSON con datos de prueba:

1. **`bankAccounts.json`**
   - Listado completo de bancos
   - Uso:
     - Selector de banco al agregar cuenta
     - Elección de entidad financiera en operaciones

2. **`sourceFunds.json`**
   - Listado de orígenes de fondos
   - Uso:
     - Selector al crear operaciones

> \*Los archivos se encuentran en `/mocks`.

-**Estrategias a implementar para manejo de errores**

1. **Errores generales de los Formularios**:
   - Validación en tiempo real para:
     - Formato de email correcto.
     - Nombre sin caracteres especiales ni números.
     - Formato de documento de identificación acorde a DNI (8 dígitos), CE (9 dígitos), PASAPORTE (de 8 a 15 caracteres)
     - Teléfono (9 dígitos)
     - Fecha de nacimiento (Solo registro valido para mayores de edad)
     - Número de cuenta bancaria solo dígitos.
2. **Errores de API**:

- Considerar errores en servicios como:
  - Número de documento o celular en uso
  - Error general en la respuesta del servicio.

```typescript
interface APIError {
  success: false
  data: {
    name: 'DUPLICATE_DNI' | 'INVALID_PHONE' | 'SERVER_ERROR' // Ejemplos
    title: string
    message: string
  }
}
```

## 📍 Instruciones de entrega

- Se necesita crear un fork del proyecto y crear un pull request con la solución.
- Crea un nuevo branch con tu nombre:
  `git checkout -b {nombre-apellido}.`
- Documenta en README.md instrucciones de ejecución
- Notifícanos al momento de completar la prueba.
- En la siguiente etapa se realizará una entrevista técnica para revisar la solución.
- El tiempo estimado para completar la prueba es de 7 días desde el inicio de la misma.

## 🏆 Criterios de Evaluación

- **Calidad de código**: Arquitectura limpia, modularización y buenas prácticas.
- **Fidelidad al diseño**: Fidelidad y creatividad en la resolución de los requerimientos de diseño
- **Performance**: Componentes optimizados y manejo eficiente de estado.
- **Mantenibilidad**: Prioriza legibilidad y escalabilidad, con estructura de archivos clara y consistente.

**Bonus (Opcional)**

- Animaciones
- Agregar en la documentación (README.md) las decisiones técnicas relevantes

---

Para cualquier duda o consulta, por favor contactar a talentohumano@kambista.com

---

Quedamos atentos a cualquier consulta adicional, muchos éxitos! 🚀
