<template>
  <van-popup v-model:show="visible" position="bottom" :style="{ height: '90%' }">
    <van-nav-bar
      :title="form.id ? '编辑任务' : '新增任务'"
      left-text="取消"
      right-text="保存"
      @click-left="onCancel"
      @click-right="onSubmit"
    />

    <van-form :model="form">
      <van-field v-model="form.name" label="任务名称" placeholder="请输入任务名" required />
      <van-field label="总进度">
        <template #input>
          <van-stepper v-model="form.total" min="1" />
        </template>
      </van-field>
      <van-field label="当前进度">
        <template #input>
          <van-stepper v-model="form.done" min="0" :max="form.total" />
        </template>
      </van-field>
      <van-field label="标签颜色">
        <template #input>
          <div class="color-options">
            <div
              v-for="color in rainbowColors"
              :key="color"
              :style="{ backgroundColor: color }"
              class="color-dot"
              :class="{ active: form.color === color }"
              @click="form.color = color"
            />
          </div>
        </template>
      </van-field>
      <van-field
        v-model="form.date"
        label="任务日期"
        placeholder="点击选择日期"
        readonly
        @click="showDatePicker = true"
      />
      <van-calendar
        v-model:show="showDatePicker"
        @confirm="onDateConfirm"
        :show-confirm="true"
        :show-title="false"
      />
    </van-form>
  </van-popup>

  <!-- <el-dialog
    :model-value="modelValue"
    :title="form.id ? '编辑任务' : '新增任务'"
    width="90%"
    @close="handleClose"
    @update:modelValue="emit"
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="总进度">
        <el-input-number v-model="form.total" :min="1" />
      </el-form-item>

      <el-form-item label="当前进度">
        <el-input-number v-model="form.done" :min="0" :max="form.total" />
      </el-form-item>

      <el-form-item label="标签颜色">
        <el-color-picker v-model="form.color" :predefine="rainbowColors" show-alpha="{false}" />
      </el-form-item>

      <el-form-item label="日期">
        <el-date-picker v-model="form.date" type="date" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="$emit('cancel')">取消</el-button>
      <el-button type="primary" @click="onSubmit">确认</el-button>
    </template>
  </el-dialog> -->
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import dayjs from 'dayjs'

const props = defineProps<{
  modelValue: boolean
  task?: Task | null
}>()

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])
const visible = ref(false)
const showDatePicker = ref(false)

watch(
  () => props.modelValue,
  (val) => (visible.value = val),
)
watch(visible, (val) => emit('update:modelValue', val))

interface Task {
  id?: string
  name: string
  total: number
  done: number
  color: string
  date: string
}

const form = ref<Task>({
  name: '',
  total: 10,
  done: 0,
  color: '#1E90FF',
  date: '',
})

const rainbowColors = [
  '#FF4C4C', // 红
  '#FF9900', // 橙
  '#FFD700', // 黄
  '#33CC66', // 绿
  '#00CED1', // 青
  '#1E90FF', // 蓝
  '#9966CC', // 紫
]

function resetForm() {
  form.value = {
    id: undefined,
    name: '',
    total: 10,
    done: 0,
    color: '#409EFF',
    date: '',
  }
}

function onDateConfirm(date: Date) {
  form.value.date = dayjs(date).format('YYYY-MM-DD')
  showDatePicker.value = false
}

function onSubmit() {
  if (!form.value.name || form.value.total <= 0) {
    return window.alert('请填写完整任务信息')
  }
  emit('submit', { ...form.value })
  visible.value = false
}

function onCancel() {
  emit('cancel')
  visible.value = false
}

watch(
  () => props.task,
  (val) => {
    if (val) form.value = { ...val }
    else resetForm()
  },
  { immediate: true },
)
</script>

<style scoped>
.color-options {
  display: flex;
  gap: 8px;
  padding: 4px 0;
}
.color-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
}
.color-dot.active {
  border-color: #000;
}
</style>
