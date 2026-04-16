import tailwindcss from '@tailwindcss/vite'

console.log('hola');

console.log(import.meta.env.NUXT_PUBLIC_API_BASE);


export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: import.meta.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api/v1',
    },
  },
  modules: ['@pinia/nuxt'],
  // Sin prefijo de carpeta: <LoginForm>, <AppModal> (ver README de nombres de archivo)
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
        },
      ],
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})