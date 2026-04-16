import { setupCalendar, DatePicker } from 'v-calendar'
import 'v-calendar/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    nuxtApp.vueApp.use(setupCalendar, {
      locales: {
        es: {
          firstDayOfWeek: 2,
          masks: { L: 'DD-MM-YYYY' }
        }
      }
    })
    nuxtApp.vueApp.component('VDatePicker', DatePicker)
  }
})