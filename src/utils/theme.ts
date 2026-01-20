import { ref } from 'vue'

export const isDark = ref(false)

export function applyTheme(dark: boolean) {
  const html = document.documentElement

  if (dark) {
    html.classList.add('dark')
    // Vant 暗色模式需要这个 class 才会切换组件变量（Popup / Calendar / NavBar 等）
    html.classList.add('van-theme-dark')
  } else {
    html.classList.remove('dark')
    html.classList.remove('van-theme-dark')
  }

  // 可选：持久化
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}

export function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
}

export function initTheme() {
  const saved = localStorage.getItem('theme')

  isDark.value =
    saved === 'dark' ||
    (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)

  applyTheme(isDark.value)
}