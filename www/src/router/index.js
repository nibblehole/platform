import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Apps', component: () => import('../views/Apps.vue') },
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/app', name: 'App', component: () => import('../views/App.vue') },
  { path: '/appcenter', name: 'AppCenter', component: () => import('../views/AppCenter.vue') }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
