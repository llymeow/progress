<template>
  <div style="padding: 16px">
    <el-button
      class="floatbtn"
      size="large"
      plain
      type="primary"
      circle
      :icon="Plus"
      @click="openDialog()"
    ></el-button>
    <draggable handle=".drag-handle" animation="200" v-model="tasks" item-key="id" @end="onDragEnd">
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
import { Plus } from '@element-plus/icons-vue'
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
  order: number // 新增排序25-12-23
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
    // 更新任务
    const res = await updateTask(task)
    const index = tasks.value.findIndex((t) => t.id === task.id)
    if (index !== -1) {
      tasks.value[index] = res
    }
  } else {
    // 创建任务
    const res = await createTask(task)
    tasks.value.push(res)
  }

  showDialog.value = false
}

async function onDragEnd() {
  for (let i = 0; i < tasks.value.length; i++) {
    const task = tasks.value[i]

    // 更新顺序
    task.order = i

    // 关键：转成普通对象
    await updateTask({ ...task })
  }
}

async function incrementTaskProgress(task: Task) {
  if (task.done >= task.total) return // 防止超过总数

  const updatedTask = { ...task, done: task.done + 1 }

  const res = await updateTask(updatedTask)

  // 更新本地任务列表
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
.floatbtn {
  position: fixed; /* 固定定位 */
  top: 10px; /* 距离顶部 120px */
  right: 10px; /* 距离右侧 20px */
}
</style>
