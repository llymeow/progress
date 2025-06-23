import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'vant/lib/index.css'
import { Popup, NavBar, Form, Field, Stepper, Calendar, Button, SwipeCell, Dialog } from 'vant'

const app = createApp(App)
app.use(Popup)
app.use(NavBar)
app.use(Form)
app.use(Field)
app.use(Stepper)
app.use(Calendar)
app.use(Button)
app.use(SwipeCell)
app.use(Dialog)
app.use(createPinia())
app.use(router)

app.mount('#app')
