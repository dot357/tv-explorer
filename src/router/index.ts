import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'


// Type-safe routes array
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  { path: '/search', name: 'Search', component: () => import('@/views/SearchView.vue') },
  { path: '/show/:id(\\d+)', name: 'ShowDetail', component: () => import('@/views/ShowDetailView.vue'), props: true },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // uses Vite’s base URL
  routes,
})

export default router


