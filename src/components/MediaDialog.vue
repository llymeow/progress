<template>
  <van-popup v-model:show="visible" position="bottom" :style="{ height: '90%' }" round>
    <div class="dialog-container">
      <div class="dialog-header">
        <button class="header-btn cancel-btn" @click="onCancel">取消</button>
        <h2 class="dialog-title">{{ form.id ? '编辑' : '新增' }}</h2>
        <button class="header-btn save-btn" @click="onSubmit">保存</button>
      </div>

      <div class="dialog-content">
        <div class="form-section">
          <label class="form-label">名称</label>
          <input
            v-model="form.name"
            class="form-input"
            type="text"
            placeholder="输入漫画名、片名或剧名"
          />
        </div>

        <div class="form-row">
          <div class="form-section half">
            <label class="form-label">类型</label>
            <div class="option-group">
              <button
                v-for="item in MEDIA_TYPES"
                :key="item.value"
                class="option-btn"
                :class="{ active: form.type === item.value }"
                @click="onTypeChange(item.value)"
              >
                {{ item.label }}
              </button>
            </div>
          </div>

          <div class="form-section half">
            <label class="form-label">状态</label>
            <div class="option-group">
              <button
                v-for="item in MEDIA_STATUSES"
                :key="item.value"
                class="option-btn"
                :class="{ active: form.status === item.value }"
                @click="onStatusChange(item.value)"
              >
                {{ item.label }}
              </button>
            </div>
          </div>
        </div>

        <div
          class="form-row progress-form-row"
          :class="{ 'progress-form-row--want': !showDoneField }"
        >
          <div class="form-section" :class="{ half: showDoneField }">
            <label class="form-label">{{ totalLabel }}</label>
            <div class="stepper-container">
              <button
                type="button"
                class="stepper-btn"
                :disabled="form.type === 'movie'"
                @click="decrementTotal"
              >
                <svg width="16" height="2" viewBox="0 0 16 2" fill="none">
                  <path d="M0 1h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>
              <input
                v-model.number="form.total"
                class="stepper-input"
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                min="1"
                :readonly="form.type === 'movie'"
                @blur="normalizeTotal"
              />
              <button
                type="button"
                class="stepper-btn"
                :disabled="form.type === 'movie'"
                @click="incrementTotal"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 0v16M0 8h16"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="showDoneField" class="form-section half">
            <label class="form-label">{{ doneLabel }}</label>
            <div class="stepper-container">
              <button type="button" class="stepper-btn" @click="decrementDone">
                <svg width="16" height="2" viewBox="0 0 16 2" fill="none">
                  <path d="M0 1h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>
              <input
                v-model.number="form.done"
                class="stepper-input"
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                min="0"
                :max="form.total"
                @blur="normalizeDone"
              />
              <button type="button" class="stepper-btn" @click="incrementDone">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 0v16M0 8h16"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
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
              <svg
                v-if="form.color === color.value"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="white"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="form-row">
          <div class="form-section half">
            <label class="form-label">开始日期</label>
            <div class="date-field">
              <button type="button" class="date-picker-btn" @click="openDatePicker('start')">
                <span :class="{ placeholder: !form.startDate }">
                  {{ form.startDate ? formatDisplayDate(form.startDate) : '选择日期' }}
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M16 2v4M8 2v4M3 10h18"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
              <button
                v-if="form.startDate"
                type="button"
                class="date-clear-btn"
                aria-label="清空开始日期"
                @click="clearDate('start')"
              >
                ×
              </button>
            </div>
          </div>

          <div class="form-section half">
            <label class="form-label">完成日期</label>
            <div class="date-field">
              <button type="button" class="date-picker-btn" @click="openDatePicker('end')">
                <span :class="{ placeholder: !form.date }">
                  {{ form.date ? formatDisplayDate(form.date) : '选择日期' }}
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M16 2v4M8 2v4M3 10h18"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
              <button
                v-if="form.date"
                type="button"
                class="date-clear-btn"
                aria-label="清空完成日期"
                @click="clearDate('end')"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <van-calendar
          :key="calendarKey"
          v-model:show="showDatePicker"
          :default-date="calendarDefaultDate"
          @confirm="onDateConfirm"
          :min-date="minDate"
          :max-date="maxDate"
          :show-confirm="true"
          :show-title="true"
          :title="datePickerTitle"
          color="var(--color-primary)"
        />
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import dayjs from 'dayjs'
import type { MediaItem, MediaType, MediaStatus } from '@/types/media'
import {
  MEDIA_TYPES,
  MEDIA_STATUSES,
  getTotalLabel,
  getDoneLabel,
  defaultTotal,
} from '@/types/media'

const props = defineProps<{
  modelValue: boolean
  media?: MediaItem | null
}>()

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])
const visible = ref(false)
const showDatePicker = ref(false)
const datePickerTarget = ref<'start' | 'end'>('start')
const calendarKey = ref(0)
const calendarDefaultDate = ref(new Date())
const minDate = new Date(1970, 0, 1)
const maxDate = new Date(2099, 11, 31)

const datePickerTitle = computed(() =>
  datePickerTarget.value === 'start' ? '选择开始日期' : '选择完成日期',
)

const totalLabel = computed(() => getTotalLabel(form.value.type))
const doneLabel = computed(() => getDoneLabel(form.value.type))
const showDoneField = computed(() => form.value.status !== 'want')

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val

    if (val) {
      if (props.media) {
        form.value = {
          ...props.media,
          startDate: props.media.startDate ?? '',
          date: props.media.date ?? '',
        }
      } else {
        resetForm()
      }
    }
  },
)

const form = ref({
  id: '',
  name: '',
  type: 'comic' as MediaType,
  status: 'want' as MediaStatus,
  total: defaultTotal('comic'),
  done: 0,
  color: '#007aff',
  startDate: dayjs().format('YYYY-MM-DD'),
  date: '',
})

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
    type: 'comic',
    status: 'want',
    total: defaultTotal('comic'),
    done: 0,
    color: '#007aff',
    startDate: dayjs().format('YYYY-MM-DD'),
    date: '',
  }
}

function onTypeChange(type: MediaType) {
  form.value.type = type
  form.value.total = defaultTotal(type)
  if (type === 'movie') {
    form.value.done = form.value.status === 'finished' ? 1 : 0
  } else if (form.value.done > form.value.total) {
    form.value.done = form.value.total
  }
}

function onStatusChange(status: MediaStatus) {
  form.value.status = status
  if (status === 'want') {
    form.value.done = 0
    form.value.date = ''
  } else if (status === 'watching') {
    if (!form.value.startDate) {
      form.value.startDate = dayjs().format('YYYY-MM-DD')
    }
    if (form.value.type === 'movie') {
      form.value.total = 1
      form.value.done = 0
    }
  } else if (status === 'finished') {
    form.value.done = form.value.total
    if (!form.value.date) {
      form.value.date = dayjs().format('YYYY-MM-DD')
    }
  }
}

function normalizeTotal() {
  let value = Number(form.value.total)
  if (!Number.isFinite(value) || value < 1) {
    value = form.value.type === 'movie' ? 1 : defaultTotal(form.value.type)
  }
  if (form.value.type === 'movie') value = 1
  form.value.total = Math.floor(value)
  if (form.value.done > form.value.total) {
    form.value.done = form.value.total
  }
}

function normalizeDone() {
  let value = Number(form.value.done)
  if (!Number.isFinite(value) || value < 0) value = 0
  if (value > form.value.total) value = form.value.total
  form.value.done = Math.floor(value)
}

function incrementTotal() {
  if (form.value.type !== 'movie') form.value.total++
}

function decrementTotal() {
  if (form.value.type === 'movie') return
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
  return dayjs(date).format('YY/MM/DD')
}

function clearDate(target: 'start' | 'end') {
  if (target === 'start') {
    form.value.startDate = ''
  } else {
    form.value.date = ''
  }
}

function openDatePicker(target: 'start' | 'end') {
  datePickerTarget.value = target
  calendarDefaultDate.value = new Date()
  calendarKey.value++
  showDatePicker.value = true
}

function onDateConfirm(date: Date) {
  const formatted = dayjs(date).format('YYYY-MM-DD')
  if (datePickerTarget.value === 'start') {
    form.value.startDate = formatted
  } else {
    form.value.date = formatted
  }
  showDatePicker.value = false
}

function onSubmit() {
  normalizeTotal()
  normalizeDone()
  if (!form.value.name || form.value.total <= 0) {
    return window.alert('请填写名称')
  }
  const payload: MediaItem = {
    ...form.value,
    startDate: form.value.startDate || null,
    date: form.value.date || null,
  }
  emit('submit', payload)
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
  min-width: 0;
}

.form-row {
  display: flex;
  gap: var(--spacing-md);
}

.progress-form-row--want {
  justify-content: center;
}

.progress-form-row--want .form-section {
  flex: none;
  width: 100%;
  max-width: 280px;
}

.progress-form-row--want .form-label {
  text-align: center;
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
  gap: 4px;
  background: var(--color-background-card);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
}

.stepper-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: var(--color-primary-soft);
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-primary);
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.stepper-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.stepper-btn:active:not(:disabled) {
  opacity: 0.7;
}

.stepper-input {
  flex: 1;
  min-width: 0;
  width: 100%;
  padding: 8px 4px;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  color: var(--color-text-primary);
  background: transparent;
  border: none;
  outline: none;
  -moz-appearance: textfield;
  appearance: textfield;
}

.stepper-input:focus {
  box-shadow: 0 0 0 2px var(--color-primary-soft);
  border-radius: var(--radius-sm);
}

.stepper-input::-webkit-outer-spin-button,
.stepper-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.stepper-input:read-only {
  color: var(--color-text-secondary);
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--color-background-card);
  border-radius: var(--radius-md);
  padding: 4px;
}

.option-btn {
  padding: 8px 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
}

.option-btn.active {
  background: var(--color-primary);
  color: white;
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
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.color-option:active {
  transform: scale(0.95);
}

.color-option.active {
  box-shadow:
    0 0 0 3px var(--color-background-card),
    0 0 0 5px currentColor;
}

.date-field {
  display: flex;
  align-items: center;
  gap: 6px;
}

.date-picker-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  min-width: 0;
  padding: var(--spacing-md);
  font-size: 15px;
  color: var(--color-text-primary);
  background: var(--color-background-card);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.date-clear-btn {
  flex-shrink: 0;
  width: 36px;
  height: 44px;
  font-size: 22px;
  line-height: 1;
  color: var(--color-text-tertiary);
  background: var(--color-background-card);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    color 0.2s ease,
    opacity 0.2s ease;
}

.date-clear-btn:active {
  color: var(--color-health-red);
  opacity: 0.8;
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
