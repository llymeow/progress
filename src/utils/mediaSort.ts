import type { MediaItem, MediaStatus } from '@/types/media'

const STATUS_ORDER: MediaStatus[] = ['want', 'watching', 'finished']

function compareByStartDate(a: MediaItem, b: MediaItem) {
  const dateA = a.startDate || '9999-12-31'
  const dateB = b.startDate || '9999-12-31'
  if (dateA !== dateB) return dateA.localeCompare(dateB)
  return (a.order ?? 0) - (b.order ?? 0)
}

export function sortItemsByStartDate(items: MediaItem[]): MediaItem[] {
  const result: MediaItem[] = []
  let order = 0

  for (const status of STATUS_ORDER) {
    const group = items.filter((item) => item.status === status).sort(compareByStartDate)
    for (const item of group) {
      result.push({ ...item, order: order++ })
    }
  }

  return result
}
