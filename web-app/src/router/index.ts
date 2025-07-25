import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About-original.vue'
import Products from '../views/Products.vue'
import News from '../views/News-original.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/products',
      name: 'products',
      component: Products
    },
    {
      path: '/news',
      name: 'news',
      component: News
    }
  ]
})

export default router