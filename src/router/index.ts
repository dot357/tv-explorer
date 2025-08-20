import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// import views (or use lazy loading)
import Home from '@/views/Home.vue'


// Type-safe routes array
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // uses Vite’s base URL
  routes,
})

export default router
