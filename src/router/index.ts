import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home/index.vue')
  },
  {
    path: '/typing',
    name: 'TypingDefault',
    component: () => import('../views/Typing/index.vue')
  },
  {
    path: '/typing/:language/:id',
    name: 'Typing',
    component: () => import('../views/Typing/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
