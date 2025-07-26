import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
// Vuetify
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

import Dashboard from './views/Dashboard.vue'
import Login from './views/Login.vue'
import ProjectForm from './views/ProjectForm.vue'

import App from './App.vue'
import './style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Dashboard },
    { path: '/dashboard', component: Dashboard },
    { path: '/login', component: Login },
    { path: '/form', component: ProjectForm },
  ],
})

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    themes: {
      light: {
        colors: {
          mainBackground: '#f9fcfa',
        },
      },
    },
  },
})

const app = createApp(App)
const pinia = createPinia()

app.use(vuetify)
app.use(router)
app.use(pinia)

app.mount('#app')
