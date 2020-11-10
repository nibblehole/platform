import { createApp } from 'vue'
import VueApp from './VueApp.vue'
import router from './router'
import 'bootstrap'
import 'bootstrap-switch'

createApp(VueApp).use(router).mount('#app')
