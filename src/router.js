// router.js
import { createRouter, createWebHistory } from 'vue-router'
import MainMenu from './components/MainMenu.vue'
import Dashboard from './components/Dashboard.vue'
import CalendarView from './components/CalendarView.vue'

const routes = [
  { path: '/', component: MainMenu },
  { path: '/dashboard', component: Dashboard },
  { path: '/calendar', component: CalendarView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router