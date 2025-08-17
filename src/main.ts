import { createApp } from 'vue'

import '@assets/styles/main.css'
import '@assets/styles/foundations.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';


const app = createApp(App)

app.use(PrimeVue, { unstyled: true })

app.mount('#app')
