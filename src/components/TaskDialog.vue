<template>
  <van-popup v-model:show="visible" position="bottom" :style="{ height: '90%' }">
    <van-nav-bar
      :title="form.id ? '编辑' : '新增'"
      left-text="取消"
      right-text="保存"
      @click-left="onCancel"
      @click-right="onSubmit"
    />

    <van-form :model="form">
      <van-field v-model="form.name" label="名称" placeholder="请输入" required />
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
      <van-field label="">
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
        label="日期"
        placeholder="点击选择"
        readonly
        @click="showDatePicker = true"
      />
      <van-calendar
        v-model:show="showDatePicker"
        @confirm="onDateConfirm"
        :min-date="minDate"
        :max-date="maxDate"
        :show-confirm="true"
        :show-title="false"
      />
    </van-form>
  </van-popup>
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
// Vant Calendar 默认 min-date 是今天；这里放开限制，允许选择任意日期（过去/未来）
const minDate = new Date(1970, 0, 1)
const maxDate = new Date(2099, 11, 31)

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val

    if (val) {
      if (props.task) {
        form.value = { ...props.task }
      } else {
        resetForm()
      }
    }
  },
)

interface Task {
  id?: string
  name: string
  total: number
  done: number
  color: string
  date: string
}

const form = ref<Task>({
  id: '',
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
    id: '',
    name: '',
    total: 10,
    done: 0,
    color: rainbowColors[0],
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
</script>

<style scoped>
.color-options {
  display: flex;
  gap: 20px;
  padding: 2px 30px;
}
.color-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
}
.color-dot.active {
  border-color: #000;
}
</style>
