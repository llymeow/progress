<template>
  <van-popup 
    v-model:show="visible" 
    position="bottom" 
    :style="{ height: '85%' }"
    round
  >
    <div class="dialog-container">
      <div class="dialog-header">
        <button class="header-btn cancel-btn" @click="onCancel">取消</button>
        <h2 class="dialog-title">{{ form.id ? '编辑任务' : '新增任务' }}</h2>
        <button class="header-btn save-btn" @click="onSubmit">保存</button>
      </div>
      
      <div class="dialog-content">
        <div class="form-section">
          <label class="form-label">任务名称</label>
          <input 
            v-model="form.name" 
            class="form-input"
            type="text"
            placeholder="输入任务名称"
          />
        </div>
        
        <div class="form-row">
          <div class="form-section half">
            <label class="form-label">目标次数</label>
            <div class="stepper-container">
              <button class="stepper-btn" @click="decrementTotal">
                <svg width="16" height="2" viewBox="0 0 16 2" fill="none">
                  <path d="M0 1h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
              <span class="stepper-value">{{ form.total }}</span>
              <button class="stepper-btn" @click="incrementTotal">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 0v16M0 8h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="form-section half">
            <label class="form-label">当前进度</label>
            <div class="stepper-container">
              <button class="stepper-btn" @click="decrementDone">
                <svg width="16" height="2" viewBox="0 0 16 2" fill="none">
                  <path d="M0 1h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
              <span class="stepper-value">{{ form.done }}</span>
              <button class="stepper-btn" @click="incrementDone">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 0v16M0 8h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <label class="form-label">主题颜色</label>
          <div class="color-picker">
            <button
              v-for="color in healthColors"
              :key="color.value"
              :style="{ backgroundColor: color.value }"
              class="color-option"
              :class="{ active: form.color === color.value }"
              @click="form.color = color.value"
              :title="color.name"
            >
              <svg v-if="form.color === color.value" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="form-section">
          <label class="form-label">截止日期</label>
          <button class="date-picker-btn" @click="showDatePicker = true">
            <span :class="{ placeholder: !form.date }">
              {{ form.date ? formatDisplayDate(form.date) : '选择日期（可选）' }}
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <van-calendar
          v-model:show="showDatePicker"
          @confirm="onDateConfirm"
          :min-date="minDate"
          :max-date="maxDate"
          :show-confirm="true"
          :show-title="true"
          title="选择日期"
          color="var(--color-primary)"
        />
      </div>
    </div>
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
  color: '#007aff',
  date: '',
})

// Apple Health 风格颜色
const healthColors = [
  { name: '红色', value: '#ff3b30' },
  { name: '橙色', value: '#ff9500' },
  { name: '黄色', value: '#ffcc00' },
  { name: '绿色', value: '#34c759' },
  { name: '薄荷', value: '#00c7be' },
  { name: '蓝色', value: '#007aff' },
  { name: '靛蓝', value: '#5856d6' },
  { name: '紫色', value: '#af52de' },
  { name: '粉色', value: '#ff2d55' },
]

function resetForm() {
  form.value = {
    id: '',
    name: '',
    total: 10,
    done: 0,
    color: '#007aff',
    date: '',
  }
}

function incrementTotal() {
  form.value.total++
}

function decrementTotal() {
  if (form.value.total > 1) {
    form.value.total--
    if (form.value.done > form.value.total) {
      form.value.done = form.value.total
    }
  }
}

function incrementDone() {
  if (form.value.done < form.value.total) {
    form.value.done++
  }
}

function decrementDone() {
  if (form.value.done > 0) {
    form.value.done--
  }
}

function formatDisplayDate(date: string) {
  return dayjs(date).format('YYYY年MM月DD日')
}

function onDateConfirm(date: Date) {
  form.value.date = dayjs(date).format('YYYY-MM-DD')
  showDatePicker.value = false
}

function onSubmit() {
  if (!form.value.name || form.value.total <= 0) {
    return window.alert('请填写任务名称')
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
.dialog-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-background-secondary);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-separator);
  background: var(--color-background-card);
}

.dialog-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.header-btn {
  font-size: 17px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
}

.cancel-btn {
  color: var(--color-primary);
}

.save-btn {
  color: var(--color-primary);
  font-weight: 600;
}

.dialog-content {
  flex: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
}

.form-section {
  margin-bottom: var(--spacing-lg);
}

.form-section.half {
  flex: 1;
}

.form-row {
  display: flex;
  gap: var(--spacing-md);
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin-bottom: var(--spacing-sm);
}

.form-input {
  width: 100%;
  padding: var(--spacing-md);
  font-size: 17px;
  color: var(--color-text-primary);
  background: var(--color-background-card);
  border: none;
  border-radius: var(--radius-md);
  outline: none;
  transition: box-shadow 0.2s ease;
}

.form-input:focus {
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.form-input::placeholder {
  color: var(--color-text-tertiary);
}

.stepper-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-background-card);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
}

.stepper-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--color-primary-soft);
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-primary);
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.stepper-btn:active {
  opacity: 0.7;
}

.stepper-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  min-width: 40px;
  text-align: center;
}

.color-picker {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  padding: var(--spacing-md);
  background: var(--color-background-card);
  border-radius: var(--radius-md);
}

.color-option {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.color-option:active {
  transform: scale(0.95);
}

.color-option.active {
  box-shadow: 0 0 0 3px var(--color-background-card), 0 0 0 5px currentColor;
}

.date-picker-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: var(--spacing-md);
  font-size: 17px;
  color: var(--color-text-primary);
  background: var(--color-background-card);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.date-picker-btn:active {
  opacity: 0.7;
}

.date-picker-btn .placeholder {
  color: var(--color-text-tertiary);
}

.date-picker-btn svg {
  color: var(--color-text-tertiary);
}
</style>
