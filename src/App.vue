<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { computed } from 'vue'
import { isDark, toggleTheme } from './utils/theme'

const icon = computed(() => (isDark.value ? 'moon' : 'sun'))

function onToggle() {
  toggleTheme()
}
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <button class="theme-btn" type="button" @click="onToggle" aria-label="Toggle theme">
        <svg v-if="icon === 'sun'" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <nav class="app-nav">
        <RouterLink to="/" class="nav-link" active-class="active">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>首页</span>
        </RouterLink>
        <RouterLink to="/stats" class="nav-link" active-class="active">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>统计</span>
        </RouterLink>
        <RouterLink to="/about" class="nav-link" active-class="active">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>关于</span>
        </RouterLink>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-background-secondary);
  padding: var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

html.dark .app-header {
  background: var(--color-background);
}

.theme-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--color-background-card);
  color: var(--color-text-secondary);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: transform 0.2s ease, color 0.2s ease;
}

.theme-btn:hover {
  color: var(--color-primary);
}

.theme-btn:active {
  transform: scale(0.95);
}

.app-nav {
  display: flex;
  gap: var(--spacing-xs);
  background: var(--color-background-card);
  padding: 4px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-sm);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--color-text-primary);
}

.nav-link.active {
  background: var(--color-primary);
  color: white;
}

.nav-link.active svg {
  stroke: white;
}

.app-main {
  flex: 1;
}

@media (min-width: 1024px) {
  .app-header {
    padding: var(--spacing-lg);
  }
}
</style>
