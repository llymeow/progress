<template>
  <van-swipe-cell>
    <el-card class="task-card" shadow="always">
      <div class="card-header">
        <div class="task-title">
          {{ task.name }} <span class="progress-info">{{ task.done }}/{{ task.total }}</span>
        </div>
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

      <el-progress
        :percentage="percentage"
        :stroke-width="10"
        :show-text="true"
        :color="task.color || '#409EFF'"
      />
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
import { Edit, Delete, Plus } from '@element-plus/icons-vue'
import { showConfirmDialog } from 'vant'

interface Task {
  name: string
  done: number
  total: number
  color?: string
}

const props = defineProps<{
  task: Task
}>()
const emit = defineEmits(['increment', 'edit', 'delete'])

const percentage = computed(() =>
  props.task.total ? Math.round((props.task.done / props.task.total) * 100) : 0,
)

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
// const isComplete = computed(() => percentage.value >= 100)
// function formatProgress() {
//   return isComplete.value ? 'Done' : `${percentage.value}%`
// }
</script>

<style scoped>
.task-card {
  margin-bottom: 16px;
  border-radius: 12px;
  position: relative;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
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
