import AOS from 'aos'
import 'aos/dist/aos.css'

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    AOS.init({
      duration: 800,
      offset: 0,
      once: true,
      easing: 'ease-out-cubic',
    })
  }
})