import { createApp } from 'vue'
import "@/assets/less/index.less"
import App from './App.vue'

import router from './router'
import ElememtPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from "pinia"
import "@/api/mock.js"
import api from '@/api/api'

const app = createApp(App);
const pinia = createPinia()
app.config.globalProperties.$api = api
app.use(pinia)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router).mount('#app')
app.use(ElememtPlus)

