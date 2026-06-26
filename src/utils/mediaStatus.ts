import dayjs from 'dayjs'
import type { MediaItem, MediaStatus } from '@/types/media'
import { isWholeUnitType } from '@/types/media'

export function applyMediaStatusChange(item: MediaItem, status: MediaStatus): MediaItem {
  const updated: MediaItem = { ...item, status }

  if (status === 'want') {
    updated.done = 0
    updated.date = null
  } else if (status === 'watching') {
    if (!updated.startDate) {
      updated.startDate = dayjs().format('YYYY-MM-DD')
    }
    if (isWholeUnitType(updated.type)) {
      updated.total = 1
      updated.done = 0
    }
  } else if (status === 'finished') {
    updated.done = updated.total
    if (!updated.date) {
      updated.date = dayjs().format('YYYY-MM-DD')
    }
  }

  return updated
}

export function getStatusActionLabel(from: MediaStatus, to: MediaStatus): string {
  if (to === 'watching') return from === 'finished' ? '重新开始看' : '开始看'
  if (to === 'finished') return '标为看过'
  return '移回想看'
}

export function getStatusActions(current: MediaStatus) {
  const targets: MediaStatus[] = ['want', 'watching', 'finished']
  return targets
    .filter((status) => status !== current)
    .map((status) => ({
      status,
      name: getStatusActionLabel(current, status),
    }))
}
