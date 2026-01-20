<template>
  <van-swipe-cell>
    <el-card class="task-card">
      <div class="drag-handle">≡</div>
      <div class="card-header">
        <div class="task-title">
          {{ task.name }} <span class="progress-info">{{ task.done }}/{{ task.total }}</span>
        </div>
        <span class="task-date">
          {{ formatDate(task.date) }}
        </span>
        <div class="card-actions">
          <el-button
            class="edit-btn"
            link
            type="primary"
            size="small"
            :disabled="task.done >= task.total"
            @click="$emit('increment', task)"
          >
            <el-icon><Plus /></el-icon>
          </el-button>
          <el-button class="edit-btn" link type="primary" size="small" @click="$emit('edit', task)">
            <el-icon><Edit /></el-icon>
          </el-button>
        </div>
      </div>

      <el-progress :percentage="percentage" :show-text="true" :color="task.color || '#409EFF'" />
    </el-card>
    <template #right>
      <el-button
        style="margin: 25px 5px"
        type="danger"
        plain
        :icon="Delete"
        circle
        @click="confirmDelete"
      />
    </template>
  </van-swipe-cell>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import dayjs from 'dayjs'
import { Edit, Delete, Plus } from '@element-plus/icons-vue'
import { showConfirmDialog } from 'vant'

interface Task {
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

const percentage = computed(() =>
  props.task.total ? Math.round((props.task.done / props.task.total) * 100) : 0,
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
  margin-bottom: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06); /* 柔和浅灰边框 */
  border-radius: 12px;
  position: relative;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.04);
}

.drag-handle {
  float: inline-start;
  padding: 0 8px;
  color: #999;
  font-size: 18px;
  cursor: grab;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-date {
  margin-right: 6px;
  font-size: 12px;
  color: #d3d3d3;
}

.card-actions {
  display: flex;
  /* gap: 2px; */
}

.task-title {
  font-size: 18px;
  font-weight: 600;
}
.progress-info {
  font-size: 14px;
  padding-left: 10px;
}
.edit-btn {
  padding: 0;
}
</style>
