<template>
  <div class="home-view">
    <div class="page-header">
      <h1 class="page-title">我的书影音</h1>
      <button class="add-btn" type="button" aria-label="新增" @click="openDialog()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
            />
          </svg>
      </button>
    </div>

    <div v-if="items.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 19.5A2.5 2.5 0 016.5 17H20"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <path d="M8 7h8M8 11h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </div>
      <p class="empty-text">暂无记录</p>
      <p class="empty-hint">点击右上角 + 添加动画、剧集、电影、漫画或图书</p>
    </div>

    <template v-else>
      <div class="search-bar">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
          <path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <input
          v-model="searchQuery"
          class="search-input"
          type="search"
          placeholder="搜索作品名称"
          enterkeyhint="search"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="search-clear"
          aria-label="清除搜索"
          @click="searchQuery = ''"
        >
          ×
        </button>
      </div>

      <div class="status-tabs">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          type="button"
          class="status-tab"
          :class="{ active: activeStatus === tab.value }"
          @click="activeStatus = tab.value"
        >
          {{ tab.label }}
          <span v-if="statusCounts[tab.value]" class="tab-count">{{ statusCounts[tab.value] }}</span>
        </button>
      </div>

      <div class="type-filters">
        <button
          v-for="chip in typeFilterChips"
          :key="chip.value"
          type="button"
          class="type-chip"
          :class="{ active: activeTypeFilter === chip.value }"
          @click="activeTypeFilter = chip.value"
        >
          {{ chip.label }}
          <span v-if="chip.count" class="chip-count">{{ chip.count }}</span>
        </button>
      </div>

      <div v-if="filteredItems.length === 0" class="empty-filter">
        <p class="empty-filter-text">
          {{ searchQuery.trim() ? '未找到匹配的作品' : '当前分类下暂无记录' }}
        </p>
        <button
          v-if="searchQuery.trim()"
          type="button"
          class="empty-filter-btn"
          @click="searchQuery = ''"
        >
          清除搜索
        </button>
        <button
          v-else-if="activeTypeFilter !== 'all'"
          type="button"
          class="empty-filter-btn"
          @click="activeTypeFilter = 'all'"
        >
          查看全部
        </button>
      </div>

      <draggable
        v-else-if="canDrag"
        handle=".drag-handle"
        animation="200"
        v-model="currentStatusItems"
        item-key="id"
        @end="onDragEnd"
        class="media-list"
        :class="{ 'media-list--finished': activeStatus === 'finished' }"
      >
        <template #item="{ element }">
          <MediaCard
            :media="element"
            @edit="openDialog"
            @delete="deleteMediaById"
            @increment="incrementProgress"
            @status-change="changeMediaStatus"
          />
        </template>
      </draggable>

      <div
        v-else
        class="media-list"
        :class="{ 'media-list--finished': activeStatus === 'finished' }"
      >
        <MediaCard
          v-for="item in filteredItems"
          :key="item.id"
          :media="item"
          @edit="openDialog"
          @delete="deleteMediaById"
          @increment="incrementProgress"
          @status-change="changeMediaStatus"
        />
      </div>
    </template>

    <MediaDialog
      v-model:modelValue="showDialog"
      :media="editingItem"
      @submit="saveMedia"
      @cancel="showDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { showToast } from 'vant'
import draggable from 'vuedraggable'
import dayjs from 'dayjs'
import {
  fetchMediaItems,
  createMediaItem,
  updateMediaItem,
  deleteMediaItem,
} from '../db/mediaStore'
import MediaCard from '../components/MediaCard.vue'
import MediaDialog from '../components/MediaDialog.vue'
import type { MediaItem, MediaStatus, MediaType } from '@/types/media'
import { MEDIA_TYPES, MEDIA_STATUS_LABELS } from '@/types/media'
import { sortItemsByStartDate } from '@/utils/mediaSort'
import { applyMediaStatusChange } from '@/utils/mediaStatus'

type TypeFilter = MediaType | 'all'

const statusTabs = [
  { value: 'watching' as MediaStatus, label: '在看' },
  { value: 'want' as MediaStatus, label: '想看' },
  { value: 'finished' as MediaStatus, label: '看过' },
]

onMounted(async () => {
  const res = await fetchMediaItems()
  items.value = res.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
})

const items = ref<MediaItem[]>([])
const activeStatus = ref<MediaStatus>('watching')
const activeTypeFilter = ref<TypeFilter>('all')
const searchQuery = ref('')
const showDialog = ref(false)
const editingItem = ref<MediaItem | null>(null)

const statusCounts = computed(() => {
  const counts: Record<MediaStatus, number> = { want: 0, watching: 0, finished: 0 }
  for (const item of items.value) {
    counts[item.status]++
  }
  return counts
})

const currentStatusItems = computed({
  get: () =>
    items.value
      .filter((t) => t.status === activeStatus.value)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  set: (val: MediaItem[]) => {
    const others = items.value.filter((t) => t.status !== activeStatus.value)
    items.value = [...val, ...others]
  },
})

const filteredItems = computed(() => {
  let list = currentStatusItems.value
  if (activeTypeFilter.value !== 'all') {
    list = list.filter((item) => item.type === activeTypeFilter.value)
  }
  const query = searchQuery.value.trim().toLowerCase()
  if (query) {
    list = list.filter((item) => item.name.toLowerCase().includes(query))
  }
  return list
})

const canDrag = computed(
  () =>
    activeStatus.value !== 'finished' &&
    activeTypeFilter.value === 'all' &&
    !searchQuery.value.trim(),
)

const typeFilterChips = computed(() => {
  const statusItems = currentStatusItems.value
  const chips: { value: TypeFilter; label: string; count: number }[] = [
    { value: 'all', label: '全部', count: statusItems.length },
  ]
  for (const type of MEDIA_TYPES) {
    const count = statusItems.filter((item) => item.type === type.value).length
    chips.push({ value: type.value, label: type.label, count })
  }
  return chips
})

function openDialog(item?: MediaItem) {
  editingItem.value = item ?? null
  showDialog.value = true
}

async function applyDateSortAndSave() {
  const sorted = sortItemsByStartDate(items.value)
  items.value = sorted
  for (const item of sorted) {
    await updateMediaItem(item)
  }
}

async function saveMedia(item: MediaItem) {
  if (!item.name || !item.total) {
    showToast('请填写完整信息')
    return
  }

  const existing = item.id ? items.value.find((t) => t.id === item.id) : null
  const needsDateSort =
    !existing ||
    existing.startDate !== item.startDate ||
    existing.status !== item.status

  if (item.id) {
    const res = await updateMediaItem(item)
    const index = items.value.findIndex((t) => t.id === item.id)
    if (index !== -1) {
      items.value[index] = res
    }
    if (needsDateSort) {
      await applyDateSortAndSave()
    }
  } else {
    const res = await createMediaItem({
      ...item,
      order: items.value.length,
    })
    items.value.push(res)
    await applyDateSortAndSave()
    activeStatus.value = item.status
  }

  showDialog.value = false
}

async function onDragEnd() {
  for (let i = 0; i < items.value.length; i++) {
    const item = items.value[i]
    item.order = i
    await updateMediaItem({ ...item })
  }
}

async function incrementProgress(item: MediaItem) {
  if (item.status !== 'watching' || item.done >= item.total) return

  const updated: MediaItem = { ...item, done: item.done + 1 }
  if (updated.done >= updated.total) {
    updated.status = 'finished'
    if (!updated.date) {
      updated.date = dayjs().format('YYYY-MM-DD')
    }
  }

  const res = await updateMediaItem(updated)
  const index = items.value.findIndex((t) => t.id === item.id)
  if (index !== -1) {
    items.value[index] = res
  }

  if (res.status === 'finished') {
    showToast('已看完，移至「看过」')
  }
}

async function changeMediaStatus(item: MediaItem, status: MediaStatus) {
  if (item.status === status) return

  const updated = applyMediaStatusChange(item, status)
  const res = await updateMediaItem(updated)
  const index = items.value.findIndex((t) => t.id === item.id)
  if (index !== -1) {
    items.value[index] = res
  }
  await applyDateSortAndSave()

  if (status !== item.status) {
    showToast(`已移至「${MEDIA_STATUS_LABELS[status]}」`)
  }
}

async function deleteMediaById(id: string) {
  await deleteMediaItem(id)
  items.value = items.value.filter((t) => t.id !== id)
}
</script>

<style scoped>
.home-view {
  padding: var(--spacing-md);
  padding-top: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.add-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4);
}

.add-btn:active {
  transform: scale(0.95);
}

.search-bar {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 0 var(--spacing-md);
  margin-bottom: var(--spacing-md);
  height: 40px;
  background: var(--color-background-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}

.search-icon {
  flex-shrink: 0;
  color: var(--color-text-tertiary);
}

.search-input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  font-size: 15px;
  color: var(--color-text-primary);
  outline: none;
}

.search-input::placeholder {
  color: var(--color-text-tertiary);
}

.search-input::-webkit-search-cancel-button {
  display: none;
}

.search-clear {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  font-size: 18px;
  line-height: 1;
  color: var(--color-text-tertiary);
  background: var(--color-separator);
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

.status-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  margin-bottom: var(--spacing-md);
  background: var(--color-background-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}

.status-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.status-tab.active {
  color: white;
  background: var(--color-primary);
}

.tab-count {
  font-size: 12px;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: rgba(0, 0, 0, 0.08);
}

.status-tab.active .tab-count {
  background: rgba(255, 255, 255, 0.25);
}

.type-filters {
  display: flex;
  gap: 8px;
  margin-bottom: var(--spacing-md);
  overflow-x: auto;
  padding-bottom: 2px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.type-filters::-webkit-scrollbar {
  display: none;
}

.type-chip {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: var(--color-background-card);
  border: 1.5px solid transparent;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-card);
}

.type-chip.active {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: var(--color-primary-soft, rgba(0, 122, 255, 0.1));
}

.chip-count {
  font-size: 11px;
  opacity: 0.7;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: var(--color-background-card);
  border-radius: var(--radius-xl);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-md);
}

.empty-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.empty-hint {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.empty-filter {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xl) var(--spacing-md);
}

.empty-filter-text {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.empty-filter-btn {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
}

.media-list {
  display: flex;
  flex-direction: column;
}

.media-list--finished {
  opacity: 0.6;
}

.media-list--finished :deep(.drag-handle) {
  visibility: hidden;
}
</style>
