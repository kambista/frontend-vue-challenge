# KAMBISTA FRONTEND CHALLENGE NUXT - SOLUCION

Esta es la solucion desarrollada para el reto tecnico de Frontend Developer en Kambista. Se ha construido una aplicacion funcional de intercambio de divisas siguiendo los requerimientos de diseño, performance y arquitectura limpia.


## INSTRUCCIONES DE EJECUCION

Sigue estos pasos para levantar el proyecto en tu entorno local:

```bash
git clone https://github.com/Adrianzzziny/frontend-vue-challenge.git
cd frontend-vue-challenge
```

Instalar dependencias:

```bash
npm install
```
Levantar el proyecto en desarrollo:
```bash
npm run dev
La aplicacion estara disponible en http://localhost:3000
```

## 📱CREDENCIALES Y DATOS DE PRUEBA

Para facilitar la revision tecnica, utiliza los siguientes datos:

MODULO DE AUTENTICACION (LOGIN)
```bash
Usuario: test@kambista.com
Contraseña: 123456
```

MODULO DE ONBOARDING (VALIDACION DE ERRORES)
Para probar el flujo de DNI Duplicado (Manejo de errores de API):
```bash
DNI a ingresar: 12345678
Cualquier otro DNI valido permitira continuar con el flujo normal.
```

## 📝 STACK TECNOLOGICO UTILIZADO

```bash
Nuxt 4: Utilizando la nueva estructura de directorios y capacidades mejoradas.

TypeScript: Tipado estricto para asegurar la robustez del codigo.

Tailwind CSS v4: Para estilos personalizados, aprovechando el nuevo motor de alto rendimiento configurado via CSS variables.

Pinia: Gestion de estado global para la autenticacion y los datos de la operacion.

Vee-Validate y Zod: Manejo de formularios y validaciones complejas con esquemas tipados.

Google Fonts: Integracion de la tipografia Montserrat para fidelidad con el diseño.
```

## 🛠️ DECISIONES TECNICAS RELEVANTES

Screaming Architecture: Se organizo el codigo por Features (Auth, Onboarding, Dashboard) para facilitar la escalabilidad.

Componentes Reutilizables: La calculadora de divisas es un componente agnostico; se usa tanto en la Landing Page publica (Index) como en el flujo interno.

Validacion de Sesion: Implementacion de Middleware para proteger rutas privadas y persistencia de datos de la calculadora en el Operation Store.

UX en Formularios: Validaciones en tiempo real para DNI, CE, Pasaporte y Celular (formato peruano), incluyendo logica de mayoria de edad (+18 años) en el selector de fecha.

Manejo de Errores: Sistema de captura de errores de API para mostrar mensajes especificos (documento en uso).

Fidelidad Visual: Implementacion de menus desplegables (dropdowns) personalizados para bancos y tipos de cuenta.

## 📤 INSTRUCCIONES DE ENTREGA
```bash
El proyecto se entrega mediante un Pull Request al repositorio original.
Branch utilizado: {adrian-escobar}.
```