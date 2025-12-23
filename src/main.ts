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

function showUpdateToast() {
  Dialog.confirm({
    title: '提示',
    message: '检测到新版本，是否立即更新？',
    confirmButtonText: '更新',
    cancelButtonText: '稍后',
  }).then(() => {
    window.location.reload()
  })
}

if ('serviceWorker' in navigator) {
  let refreshing = false

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    refreshing = true
    window.location.reload()
  })

  navigator.serviceWorker.ready.then((registration) => {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // 检测到更新：弹出提示
            showUpdateToast()
          }
        })
      }
    })
  })
}
