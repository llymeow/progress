<template>
  <van-swipe-cell>
    <div
      class="media-card"
      :class="{ 'media-card--long-pressing': isLongPressing }"
      @touchstart.passive="onPressStart"
      @touchend="onPressEnd"
      @touchmove="onPressMove"
      @touchcancel="onPressEnd"
      @mousedown="onPressStart"
      @mouseup="onPressEnd"
      @mouseleave="onPressEnd"
      @mousemove="onPressMove"
      @contextmenu.prevent="onContextMenu"
    >
      <div class="card-content">
        <div class="card-left">
          <div class="drag-handle">
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path
                d="M0 1h14M0 5h14M0 9h14"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <div class="media-info">
            <div class="media-title-row">
              <span class="type-badge" :class="`type-badge--${media.type}`">
                {{ MEDIA_TYPE_LABELS[media.type] }}
              </span>
              <span class="media-title">{{ media.name }}</span>
            </div>
            <div class="media-meta">
              <span class="media-progress" v-if="progressText">{{ progressText }}</span>
              <span class="media-date" v-if="dateRangeText">{{ dateRangeText }}</span>
            </div>
          </div>
        </div>

        <div class="card-right">
          <div
            class="progress-ring-container"
            :class="{ 'progress-ring-container--disabled': !canIncrement }"
            @click="onIncrement"
          >
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
                :stroke="media.color || '#007aff'"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="strokeDashoffset"
                stroke-linecap="round"
              />
            </svg>
            <div class="progress-text" :class="{ 'progress-text--want': media.status === 'want' }">
              <template v-if="media.type === 'movie'">
                <span class="progress-done">{{ media.done >= media.total ? '✓' : '—' }}</span>
              </template>
              <template v-else-if="media.status === 'want'">
                <span class="progress-done progress-done--solo">{{ media.total }}</span>
              </template>
              <template v-else>
                <span class="progress-done">{{ media.done }}</span>
                <span class="progress-total">/{{ media.total }}</span>
              </template>
            </div>
          </div>

          <button class="action-btn" @click="$emit('edit', media)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <template #right>
      <button class="delete-btn" @click="confirmDelete">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </template>
  </van-swipe-cell>

  <van-action-sheet
    v-model:show="showStatusSheet"
    title=""
    :actions="statusActions"
    cancel-text="取消"
    close-on-click-action
    @select="onStatusSelect"
  />
</template>

<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import { showConfirmDialog } from 'vant'
import type { MediaItem, MediaStatus } from '@/types/media'
import { MEDIA_TYPE_LABELS, getProgressUnit } from '@/types/media'
import { getStatusActions } from '@/utils/mediaStatus'

interface StatusAction {
  name: string
  status: MediaStatus
}

const LONG_PRESS_MS = 500

const props = defineProps<{
  media: MediaItem
}>()

const emit = defineEmits<{
  increment: [media: MediaItem]
  edit: [media: MediaItem]
  delete: [id: string]
  statusChange: [media: MediaItem, status: MediaStatus]
}>()

const showStatusSheet = ref(false)
const isLongPressing = ref(false)
let pressTimer: ReturnType<typeof setTimeout> | null = null
let pressStartX = 0
let pressStartY = 0

const statusActions = computed<StatusAction[]>(() =>
  getStatusActions(props.media.status).map((action) => ({
    name: action.name,
    status: action.status,
  })),
)

const circumference = 2 * Math.PI * 24
const percentage = computed(() => (props.media.total ? props.media.done / props.media.total : 0))
const strokeDashoffset = computed(() => circumference - percentage.value * circumference)

const canIncrement = computed(
  () => props.media.status === 'watching' && props.media.done < props.media.total,
)

function formatDate(date?: string | null) {
  if (!date) return ''
  return dayjs(date).format('YY/MM/DD')
}

const dateRangeText = computed(() => {
  const start = formatDate(props.media.startDate)
  const end = formatDate(props.media.date)
  if (start && end) return `${start} ~ ${end}`
  return start || end
})

const progressText = computed(() => {
  if (props.media.type === 'movie') {
    if (props.media.status === 'finished') return '已观看'
    return ''
  }
  if (props.media.status === 'want') return ''
  const unit = getProgressUnit(props.media.type)
  if (!unit || !props.media.total) return ''
  return `${props.media.done} / ${props.media.total} ${unit}`
})

function onIncrement() {
  if (canIncrement.value) {
    emit('increment', props.media)
  }
}

function isInteractiveTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null
  if (!el) return true
  return !!el.closest('.drag-handle, .progress-ring-container, .action-btn, .delete-btn')
}

function clearPressTimer() {
  if (pressTimer) {
    clearTimeout(pressTimer)
    pressTimer = null
  }
  isLongPressing.value = false
}

function onPressStart(event: TouchEvent | MouseEvent) {
  if (isInteractiveTarget(event.target)) return
  if ('button' in event && event.button !== 0) return

  const point = 'touches' in event ? event.touches[0] : event
  pressStartX = point.clientX
  pressStartY = point.clientY

  clearPressTimer()
  isLongPressing.value = true
  pressTimer = setTimeout(() => {
    pressTimer = null
    isLongPressing.value = false
    navigator.vibrate?.(10)
    showStatusSheet.value = true
  }, LONG_PRESS_MS)
}

function onPressMove(event: TouchEvent | MouseEvent) {
  if (!pressTimer) return
  const point = 'touches' in event ? event.touches[0] : event
  const dx = point.clientX - pressStartX
  const dy = point.clientY - pressStartY
  if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
    clearPressTimer()
  }
}

function onPressEnd() {
  clearPressTimer()
}

function onContextMenu(event: MouseEvent) {
  if (isInteractiveTarget(event.target)) return
  showStatusSheet.value = true
}

function onStatusSelect(action: StatusAction) {
  if (action.status) {
    emit('statusChange', props.media, action.status)
  }
}

onBeforeUnmount(() => {
  clearPressTimer()
})

function confirmDelete() {
  showConfirmDialog({
    title: '确认删除',
    message: `确定删除「${props.media.name}」吗？`,
  })
    .then(() => {
      if (props.media.id) emit('delete', props.media.id)
    })
    .catch(() => {})
}
</script>

<style scoped>
.media-card {
  background: var(--color-background-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-card);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.media-card:active {
  transform: scale(0.98);
}

.media-card--long-pressing {
  transform: scale(0.98);
  opacity: 0.92;
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

.media-info {
  flex: 1;
  min-width: 0;
}

.media-title-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 0;
}

.type-badge {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1.4;
}

.type-badge--comic {
  background: rgba(0, 122, 255, 0.15);
  color: var(--color-primary);
}

.type-badge--anime {
  background: rgba(255, 45, 85, 0.15);
  color: #ff2d55;
}

.type-badge--movie {
  background: rgba(255, 149, 0, 0.15);
  color: var(--color-health-orange, #ff9500);
}

.type-badge--tv {
  background: rgba(88, 86, 214, 0.15);
  color: #5856d6;
}

.media-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.media-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: 2px;
  flex-wrap: wrap;
}

.media-progress {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary);
}

.media-date {
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

.progress-ring-container--disabled {
  cursor: default;
  opacity: 0.5;
}

.progress-ring-container:not(.progress-ring-container--disabled):active {
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

.progress-text--want {
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-done--solo {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
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
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
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
