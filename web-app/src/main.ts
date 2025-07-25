import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import './assets/styles/original-style.css'
import App from './App.vue'
// import App from './App-simple.vue'

console.log('Starting Vue app...')

try {
  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  
  app.config.errorHandler = (err, vm, info) => {
    console.error('Vue Error:', err, info)
  }
  
  app.mount('#app')
  console.log('Vue app mounted successfully')
} catch (error) {
  console.error('Failed to start Vue app:', error)
  document.body.innerHTML = '<h1>App Loading Error</h1><pre>' + error + '</pre>'
}
