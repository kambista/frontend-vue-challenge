# Reto frontend — Kambista

Aplicación de intercambio de divisas según el diseño en [Figma](https://www.figma.com/design/CkUU2J5WZNACGQVy3vFr45/Untitled?node-id=0-1&p=f&t=3p9NiX4qWDMnL8g9-0).

[Kambista](https://kambista.com).

## Stack obligatorio

- **Nuxt 4** con TypeScript  
- **Tailwind CSS** (estilos personalizados)  
- **Pinia** (estado)

## Instrucciones de ejecución

**Requisitos:** Node.js **20+** (LTS recomendada) y npm.

```bash
npm install
npm run dev
```

Abre **http://localhost:3000** (u otro puerto si la consola lo indica).

**Variable de entorno:** copia `.env.example` a `.env` y ajusta `NUXT_PUBLIC_API_BASE` si hace falta (ver [API consumida por este frontend](#api-consumida-por-este-frontend)). Si no existe `.env`, aplica el valor por defecto de `nuxt.config.ts`.

**Otros scripts:** `npm run build`, `npm run preview` (tras `build`), `npm run generate`.

## Requerimientos funcionales

### 1. Autenticación

- **Login:** formulario con validación en tiempo real.

### 2. Onboarding

1. **Datos personales:** formulario con validación en tiempo real y manejo de errores del servicio (p. ej. DNI duplicado).

   Ejemplo de respuesta de error:

   ```json
   {
     "success": false,
     "data": {
       "name": "DUPLICATE_DNI",
       "title": "DNI en uso",
       "message": "El número de documento registrado ya está en uso."
     }
   }
   ```

2. **Registro exitoso:** pantalla que confirme el registro completo.

### 3. Transacciones

1. **Pantalla principal:** calculadora de cotización; consumo de API de tipo de cambio y de cálculo de operación; cálculos en tiempo real.
2. **Información adicional del cambio:** selección de bancos y origen de fondos desde la API; cuenta de destino con selector de banco, tipo de cuenta (ahorro/crédito), número de cuenta (solo dígitos) y validación en tiempo real.
3. **Datos de transferencia:** datos de la cuenta bancaria de Kambista.
4. **Voucher:** formulario para adjuntar el comprobante del depósito.
5. **Transacción creada:** resumen de la operación.

## API consumida por este frontend

La app arma las peticiones con `useApi()` / `useRuntimeConfig().public.apiBase`. En esta solución la base apunta a una **API propia** (Railway), configurada con `NUXT_PUBLIC_API_BASE`:

**Base**

```
https://own-api-kambista-production.up.railway.app/api/v1/
```

**Rutas relativas** a esa base (según `useAuthApi` y `useKambistaApi`):

- **Auth:** `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`
- **Cambio:** `GET /exchange/current`, `GET /exchange/calculate` (query: monedas, monto, etc.)
- **Catálogo / cuentas:** `GET /banks`, `GET /source-funds`, `GET /cuentas-usuario`, `POST /cuentas-usuario`

### Misma API que el cliente React Native

La URL base (`NUXT_PUBLIC_API_BASE`) es **la misma** que consume el proyecto en **React Native**: un solo backend. Los **usuarios son compartidos**: si ya creaste una cuenta desde la app móvil, puedes **usar la web** iniciando sesión con el **mismo correo y contraseña** (y al revés).

### Uso en la web

Para poder usar el flujo en el navegador hace falta una cuenta válida. Lo habitual es:

1. Ir a la **vista de registro** y **crear un usuario** con **correo electrónico y contraseña** (datos personales según el formulario), o  
2. Si el usuario ya existe (por ejemplo porque se registró en la app React Native), usar **iniciar sesión** con ese correo y contraseña.

Sin credenciales correctas no podrás acceder a las rutas protegidas (cambio, transacciones, etc.).
