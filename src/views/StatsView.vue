<template>
  <div class="stats-view">
    <div class="stats-header">
      <h1 class="page-title">统计</h1>
      <p class="page-subtitle">我「看过」</p>
    </div>

    <div class="summary-grid">
      <div class="summary-card summary-card--primary">
        <span class="summary-value">{{ summary.totalFinished }}</span>
        <span class="summary-label">累计看过</span>
      </div>
      <div class="summary-card">
        <span class="summary-value">{{ summary.thisMonth }}</span>
        <span class="summary-label">本月</span>
      </div>
      <div class="summary-card">
        <span class="summary-value">{{ summary.thisYear }}</span>
        <span class="summary-label">今年</span>
      </div>
      <div class="summary-card">
        <span class="summary-value">{{ summary.watching }}</span>
        <span class="summary-label">在看</span>
      </div>
    </div>

    <div class="period-tabs">
      <button
        type="button"
        class="period-tab"
        :class="{ active: periodMode === 'month' }"
        @click="periodMode = 'month'"
      >
        按月
      </button>
      <button
        type="button"
        class="period-tab"
        :class="{ active: periodMode === 'year' }"
        @click="periodMode = 'year'"
      >
        按年
      </button>
    </div>

    <div v-if="loading" class="loading-text">加载中…</div>

    <div v-else-if="periodStats.length === 0" class="empty-state">
      <p class="empty-text">暂无记录</p>
      <p class="empty-hint">标记为「看过」并填写完成日期后会出现在这里</p>
    </div>

    <div v-else class="period-list">
      <div v-for="stat in periodStats" :key="stat.key" class="period-card">
        <div class="period-card-header">
          <span class="period-label">{{ stat.label }}</span>
          <span class="period-total">{{ stat.total }} 部</span>
        </div>

        <div class="period-bar-track">
          <div class="period-bar-fill" :style="{ width: `${(stat.total / maxTotal) * 100}%` }" />
        </div>

        <div class="type-breakdown">
          <span
            v-for="t in stat.byType"
            :key="t.type"
            class="type-tag"
            :class="`type-tag--${t.type}`"
          >
            {{ t.label }} {{ t.count }}
          </span>
        </div>

        <ul v-if="expandedKeys.has(stat.key)" class="name-list">
          <li v-for="name in stat.names" :key="name">{{ name }}</li>
        </ul>
        <button type="button" class="toggle-names-btn" @click="toggleExpand(stat.key)">
          {{ expandedKeys.has(stat.key) ? '收起' : '查看作品' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchMediaItems } from '@/db/mediaStore'
import type { MediaItem } from '@/types/media'
import {
  groupFinishedByPeriod,
  getStatsSummary,
  getMaxPeriodTotal,
  type StatsPeriod,
} from '@/utils/mediaStats'

const items = ref<MediaItem[]>([])
const loading = ref(true)
const periodMode = ref<StatsPeriod>('month')
const expandedKeys = ref(new Set<string>())

onMounted(async () => {
  items.value = await fetchMediaItems()
  loading.value = false
})

const summary = computed(() => getStatsSummary(items.value))

const periodStats = computed(() => groupFinishedByPeriod(items.value, periodMode.value))

const maxTotal = computed(() => getMaxPeriodTotal(periodStats.value))

function toggleExpand(key: string) {
  const next = new Set(expandedKeys.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expandedKeys.value = next
}
</script>

<style scoped>
.stats-view {
  padding: var(--spacing-md);
  padding-top: 0;
}

.stats-header {
  margin-bottom: var(--spacing-lg);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.summary-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--color-background-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.summary-card--primary {
  grid-column: span 2;
  flex-direction: row;
  justify-content: center;
  gap: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-primary) 0%, #5856d6 100%);
}

.summary-card--primary .summary-value,
.summary-card--primary .summary-label {
  color: white;
}

.summary-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.summary-card:not(.summary-card--primary) .summary-value {
  font-size: 22px;
}

.summary-label {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.period-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  margin-bottom: var(--spacing-md);
  background: var(--color-background-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}

.period-tab {
  flex: 1;
  padding: 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-tab.active {
  color: white;
  background: var(--color-primary);
}

.loading-text {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-md);
}

.empty-text {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.empty-hint {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.period-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.period-card {
  padding: var(--spacing-md);
  background: var(--color-background-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.period-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.period-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.period-total {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-primary);
}

.period-bar-track {
  height: 8px;
  background: var(--color-separator);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: var(--spacing-sm);
}

.period-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), #5856d6);
  border-radius: 4px;
  transition: width 0.4s ease;
  min-width: 4px;
}

.type-breakdown {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: var(--spacing-sm);
}

.type-tag {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
}

.type-tag--comic {
  background: rgba(0, 122, 255, 0.15);
  color: var(--color-primary);
}

.type-tag--anime {
  background: rgba(255, 45, 85, 0.15);
  color: #ff2d55;
}

.type-tag--movie {
  background: rgba(255, 149, 0, 0.15);
  color: #ff9500;
}

.type-tag--tv {
  background: rgba(88, 86, 214, 0.15);
  color: #5856d6;
}

.name-list {
  list-style: none;
  margin: 0 0 var(--spacing-sm);
  padding: var(--spacing-sm) 0 0;
  border-top: 1px solid var(--color-separator);
}

.name-list li {
  font-size: 14px;
  color: var(--color-text-secondary);
  padding: 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toggle-names-btn {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.toggle-names-btn:active {
  opacity: 0.7;
}
</style>
