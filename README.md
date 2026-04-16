# Kambista Frontend Challenge - Solución

Esta es la solución a la prueba técnica para Frontend Developer de **Kambista**. Se ha desarrollado una aplicación funcional de intercambio de divisas ("compra/venta") y flujo de usuario respetando un diseño premium.

> Puedes leer las instrucciones requeridas originales del desafío en [CHALLENGE.md](./CHALLENGE.md).

## 🚀 Cómo ejecutar el proyecto localmente

1. **Instalar dependencias**
   ```bash
   npm install
   ```
2. **Levantar servidor de desarrollo**
   *(Ejecuta el proyecto utilizando Nuxt 4)*
   ```bash
   npm run dev
   ```
3. Navega a `http://localhost:3000` en tu navegador web favorito para acceder a la aplicación interactiva.

---

## � Demostración

Revisa cómo funciona la aplicación en ambos formatos:

### 🖥️ Versión Desktop
[![Ver demo desktop](https://img.youtube.com/vi/_KZIFVvLEWs/0.jpg)](https://www.youtube.com/watch?v=_KZIFVvLEWs)

### 📱 Versión Mobile
[![Ver demo mobile](https://img.youtube.com/vi/A4LvRwn5blg/0.jpg)](https://www.youtube.com/watch?v=A4LvRwn5blg)

---

## �🛠 Decisiones Técnicas y Arquitectura

A continuación, se detallan las decisiones técnicas relevantes tomadas para el desarrollo de esta solución:

### 1. Framework y Base (Nuxt 4 + Vue 3 + TypeScript)
- Se utilizó **Nuxt 4** junto con la **Composition API (script setup)** de Vue 3, aprovechando la reactividad moderna y el auto-import de componentes/composables para un código más limpio.
- **TypeScript** fue implementado de manera estricta para asegurar un tipado fuerte (interfaces de `APIError`, `OperationData`, `KambistaBankAccount`), previniendo errores en tiempo de desarrollo y mejorando la calidad del código.

### 2. Manejo de Estado Global (Pinia)
- Se creó un store dedicado (`operation.ts`) utilizando Pinia para gestionar el complejo flujo multicapa de transacciones ("Completa" -> "Transfiere" -> "Constancia").
- Esta abstracción permite mantener la persistencia temporal de la información de la operación (bancos origen/destino, fondos, tasas actuales) entre cambios de rutas y componentes sin forzar el acoplamiento directo entre vistas.
- Se ha incluido lógica computada dentro del store (ej. cálculo en tiempo real de "Koinks") para asegurar que el estado derivado sea consistente en toda la aplicación.

### 3. Estilos y Diseño Sensible (Tailwind CSS)
- La aplicación fue construida adoptando un enfoque **Mobile-First** con **Tailwind CSS**.
- En lugar de ensuciar las clases repetitivas, se empleó un sistema de componentes atómicos (`KButton`, `KInput`, `KSelect`, etc.) estilizados con Tailwind para mantener fidelidad con el diseño de Figma y asegurar su reutilización.
- Se agregaron clases transitivas y paletas de colores exclusivas (ej. `kambista-teal`, `kambista-navy`) configuradas directo en `tailwind.config.js`.

### 4. Integración y Resiliencia con APIs (Kambista)
- Se implementó un flujo resiliente para el consumo de las APIs del tipo de cambio. Empleando `$fetch` de Nuxt, se incluyeron adaptaciones dinámicas para lidiar con posibles mutaciones de campos de respuesta (ej. soporte a keys como `bid`/`ask` o `compra`/`venta`).
- Se introdujo un "fallback" local (tasas y cálculos en `computed`) en caso de que la respuesta oficial de la API tarde, minimizando el impacto negativo de latencia para el usuario y asegurando que la UI sea reactiva en "tiempo real".

### 5. Validación de Formularios Custom
- Se optó por construir un **mecanismo de validación reactivo hecho a medida** usando propiedades `computed` y modifers nativos en lugar de librerías de terceros engorrosas y pesadas (como VeeValidate).
- Se implementaron expresiones regulares personalizadas y reglas específicas para casos como el login, el registro y el "drawer" de añadir cuenta, garantizando feedback visual y estados de error interactivos tal cual estipulan los requisitos funcionales.

### 6. Animaciones y Experiencia de Usuario (UX)
- Se incluyeron micro-animaciones (ej. íconos de carga fluida, transiciones CSS en dropdowns/drawers fluidas).
- Se añadió la biblioteca `canvas-confetti` como celebración visual al finalizar la constancia de operación exitosamente para dar un toque premium final a nivel de UX.

### 7. Flujo de Onboarding (Login + Register)
- El proceso de incorporación está dividido en **dos etapas separadas**: `/register` (crear cuenta) → `/onboarding` (completar datos) → `/bienvenido` (bienvenida).
- Tanto el registro como el inicio de sesión redirigen a `/onboarding` si el usuario no ha completado sus datos (`hasCompletedOnboarding = false` en el store).
- Al finalizar el onboarding y pulsar "Continuar" en `/bienvenido`, se activa `completeOnboarding()` en Pinia, marcando el flag como `true` para evitar que el usuario vuelva a ver el flujo en sesiones posteriores.

---

## 📁 Estructura de Carpetas

```
frontend-vue-challenge/
├── app/                          # Directorio raíz de la app (convención Nuxt 4)
│   ├── app.vue                   # Punto de entrada principal
│   ├── assets/
│   │   └── css/
│   │       └── main.css          # Directivas Tailwind y estilos globales
│   ├── components/
│   │   ├── K*.vue                # Componentes atómicos de UI (KButton, KInput, etc.)
│   │   ├── base/                 # Componentes base reutilizables (Banner, Card, etc.)
│   │   ├── layout/               # Componentes estructurales (AppHeader, AppStepper)
│   │   ├── operation/            # Componentes del resumen de operación
│   │   └── transfer/             # Componentes del flujo de transferencia (Steps, Modal, Drawer)
│   ├── composables/
│   │   ├── useClipboard.ts       # Copia al portapapeles
│   │   ├── useCountdown.ts       # Cuenta regresiva para el tiempo de tasa
│   │   ├── useMocks.ts           # Datos simulados (bancos, fondos)
│   │   └── useOperationFlow.ts   # Lógica de navegación entre pasos
│   ├── layouts/
│   │   ├── auth.vue              # Layout para páginas de autenticación
│   │   ├── default.vue           # Layout principal con header
│   │   └── operation.vue         # Layout del flujo de operación con stepper
│   ├── middleware/
│   │   └── operation-guard.ts    # Protege rutas de operación según el paso actual
│   ├── pages/
│   │   ├── index.vue             # Ruta raíz (redirige al dashboard o login)
│   │   ├── login.vue             # Inicio de sesión
│   │   ├── register.vue          # Registro: crea cuenta (email, usuario, contraseña)
│   │   ├── onboarding.vue        # Completa datos personales (doc, teléfono, nacimiento)
│   │   ├── bienvenido.vue        # Pantalla de bienvenida post-onboarding
│   │   ├── dashboard.vue         # Panel principal con calculadora de cambio
│   │   └── operacion/
│   │       ├── completa.vue      # Paso 1: Completa los datos de la operación
│   │       ├── transfiere.vue    # Paso 2: Instrucciones de transferencia bancaria
│   │       └── constancia.vue    # Paso 3: Constancia y confirmación final
│   ├── stores/
│   │   └── operation.ts          # Store Pinia: estado global de operación y onboarding
│   ├── types/
│   │   └── operation.ts          # Interfaces TypeScript (OperationData, APIError, etc.)
│   └── utils/
│       └── formatters.ts         # Helpers de formato (moneda, fechas, etc.)
├── mocks/
│   ├── bankAccounts.json         # Datos simulados de cuentas bancarias del usuario
│   └── sourceFunds.json          # Opciones de origen de fondos
├── public/
│   └── images/                   # Recursos estáticos (ilustraciones, íconos)
├── nuxt.config.ts                # Configuración de Nuxt (módulos, runtime config)
├── tailwind.config.js            # Tema extendido (colores kambista-teal, kambista-navy)
└── tsconfig.json                 # Configuración TypeScript estricta
```

### Por qué esta estructura

La organización sigue la **convención de directorios de Nuxt 4** (`app/`) para beneficiarse del auto-import de componentes, composables y stores sin necesidad de importaciones explícitas, reduciendo el boilerplate.

Dentro de `components/` se adoptó una **clasificación por dominio** en lugar de un único directorio plano:
- `K*.vue` — átomos de UI agnósticos al dominio, reutilizables en cualquier parte.
- `base/` — componentes ligeramente más compuestos (Card, Banner) que aún no pertenecen a un dominio específico.
- `operation/` y `transfer/` — componentes acoplados al dominio de negocio, agrupados para facilitar su localización y mantenimiento.

Los **composables** encapsulan lógica de comportamiento (temporizadores, portapapeles, flujo de pasos) desacoplada de la UI, facilitando las pruebas unitarias y la reutilización entre vistas.

El **store único de Pinia** (`operation.ts`) centraliza tanto el estado transaccional como el flag de onboarding, evitando la proliferación de stores innecesarios para una aplicación de esta escala.
