import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { Icon } from '@iconify/vue'
import VueSweetalert2 from 'vue-sweetalert2'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(VueSweetalert2)
app.component('Icon', Icon)

app.mount('#app')
