<template>
  <div class="home-view">
    <div class="page-header">
      <h1 class="page-title">我的任务</h1>
      <button class="add-btn" @click="openDialog()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    
    <div v-if="tasks.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/>
          <path d="M9 12h6M9 16h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <p class="empty-text">暂无任务</p>
      <p class="empty-hint">点击右上角 + 创建新任务</p>
    </div>
    
    <draggable 
      v-else
      handle=".drag-handle" 
      animation="200" 
      v-model="tasks" 
      item-key="id" 
      @end="onDragEnd"
      class="task-list"
    >
      <template #item="{ element }">
        <TaskCard
          :task="element"
          @edit="openDialog"
          @delete="deleteTaskById"
          @increment="incrementTaskProgress"
        />
      </template>
    </draggable>
    
    <TaskDialog
      v-model:modelValue="showDialog"
      :task="editingTask"
      @submit="saveTask"
      @cancel="showDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import draggable from 'vuedraggable'
import { fetchTasks, createTask, updateTask, deleteTask } from '../db/taskStore'
import TaskCard from '../components/TaskCard.vue'
import TaskDialog from '../components/TaskDialog.vue'

onMounted(async () => {
  const res = await fetchTasks()
  tasks.value = res.sort((a, b) => a.order - b.order)
})

interface Task {
  id?: string
  name: string
  total: number
  done: number
  color: string
  date: string | null
  order: number
}

const tasks = ref<Task[]>([])
const showDialog = ref(false)
const editingTask = ref<Task | null>(null)

function openDialog(task?: Task) {
  editingTask.value = task ?? null
  showDialog.value = true
}

async function saveTask(task: Task) {
  if (!task.name || !task.total) {
    ElMessage.warning('请填写完整的任务信息')
    return
  }

  if (task.id) {
    const res = await updateTask(task)
    const index = tasks.value.findIndex((t) => t.id === task.id)
    if (index !== -1) {
      tasks.value[index] = res
    }
  } else {
    const res = await createTask(task)
    tasks.value.push(res)
  }

  showDialog.value = false
}

async function onDragEnd() {
  for (let i = 0; i < tasks.value.length; i++) {
    const task = tasks.value[i]
    task.order = i
    await updateTask({ ...task })
  }
}

async function incrementTaskProgress(task: Task) {
  if (task.done >= task.total) return

  const updatedTask = { ...task, done: task.done + 1 }
  const res = await updateTask(updatedTask)

  const index = tasks.value.findIndex((t) => t.id === task.id)
  if (index !== -1) {
    tasks.value[index] = res
  }
}

async function deleteTaskById(id: string) {
  await deleteTask(id)
  tasks.value = tasks.value.filter((t) => t.id !== id)
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
  margin-bottom: var(--spacing-lg);
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.add-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4);
}

.add-btn:active {
  transform: scale(0.95);
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

.task-list {
  display: flex;
  flex-direction: column;
}
</style>
