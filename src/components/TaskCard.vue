<template>
  <van-swipe-cell>
    <div class="task-card">
      <div class="card-content">
        <div class="card-left">
          <div class="drag-handle">
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M0 1h14M0 5h14M0 9h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="task-info">
            <div class="task-title">{{ task.name }}</div>
            <div class="task-meta">
              <span class="task-date" v-if="task.date">{{ formatDate(task.date) }}</span>
            </div>
          </div>
        </div>
        
        <div class="card-right">
          <div class="progress-ring-container" @click="$emit('increment', task)">
            <svg class="progress-ring" viewBox="0 0 60 60">
              <circle
                class="progress-ring-bg"
                cx="30"
                cy="30"
                r="24"
                fill="none"
                stroke-width="6"
              />
              <circle
                class="progress-ring-fill"
                cx="30"
                cy="30"
                r="24"
                fill="none"
                stroke-width="6"
                :stroke="task.color || '#007aff'"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="strokeDashoffset"
                stroke-linecap="round"
              />
            </svg>
            <div class="progress-text">
              <span class="progress-done">{{ task.done }}</span>
              <span class="progress-total">/{{ task.total }}</span>
            </div>
          </div>
          
          <button class="action-btn" @click="$emit('edit', task)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <template #right>
      <button class="delete-btn" @click="confirmDelete">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </template>
  </van-swipe-cell>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import { showConfirmDialog } from 'vant'

interface Task {
  id?: string
  name: string
  done: number
  total: number
  color?: string
  date: string
}

const props = defineProps<{
  task: Task
}>()
const emit = defineEmits(['increment', 'edit', 'delete'])

const circumference = 2 * Math.PI * 24
const percentage = computed(() =>
  props.task.total ? (props.task.done / props.task.total) : 0
)
const strokeDashoffset = computed(() =>
  circumference - (percentage.value * circumference)
)

function formatDate(date?: string) {
  if (!date) return ''
  return dayjs(date).format('MM/DD (ddd)')
}

function confirmDelete() {
  showConfirmDialog({
    title: '确认删除',
    message: `确定删除任务「${props.task.name}」吗？`,
  })
    .then(() => {
      emit('delete', props.task.id)
    })
    .catch(() => {
      /* 用户取消操作 */
    })
}
</script>

<style scoped>
.task-card {
  background: var(--color-background-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-card);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.task-card:active {
  transform: scale(0.98);
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
}

.card-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  min-width: 0;
}

.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--color-text-tertiary);
  cursor: grab;
  flex-shrink: 0;
}

.drag-handle:active {
  cursor: grabbing;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: 2px;
}

.task-date {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.card-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.progress-ring-container {
  position: relative;
  width: 60px;
  height: 60px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.progress-ring-container:active {
  transform: scale(0.95);
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-ring-bg {
  stroke: var(--color-separator);
}

.progress-ring-fill {
  transition: stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  line-height: 1;
}

.progress-done {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.progress-total {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: var(--color-primary-soft);
  border-radius: var(--radius-sm);
  color: var(--color-primary);
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.action-btn:active {
  transform: scale(0.95);
  opacity: 0.8;
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 100%;
  min-height: 92px;
  border: none;
  background: var(--color-health-red);
  color: white;
  cursor: pointer;
  margin-left: var(--spacing-sm);
  border-radius: var(--radius-lg);
}

.delete-btn:active {
  opacity: 0.8;
}
</style>
