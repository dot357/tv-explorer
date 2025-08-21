import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';



import '@assets/styles/main.css'
import 'primeicons/primeicons.css'
import '@assets/styles/foundations.css'
import '@assets/styles/recipes.css'



import 'primevue/datatable/style';
import 'primevue/paginator/style';
import Aura from '@primeuix/themes/aura';



import router from './router'



const app = createApp(App)

app.use(PrimeVue, {
  unstyled: true,
  theme: {
    preset: Aura,
    options: {
      cssLayer: false // stops global layer injection
    }
  }
})
app.use(router)


app.mount('#app')



