import { createApp } from 'vue'

import '@assets/styles/main.css'
import 'primeicons/primeicons.css'
import '@assets/styles/foundations.css'
import '@assets/styles/recipes.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import router from './router'



const app = createApp(App)

app.use(PrimeVue, { unstyled: true })
app.use(router)

app.mount('#app')

