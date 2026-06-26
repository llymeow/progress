import dayjs from 'dayjs'
import type { MediaItem, MediaType } from '@/types/media'
import { MEDIA_TYPES } from '@/types/media'

export type StatsPeriod = 'month' | 'year'

export interface TypeCount {
  type: MediaType
  label: string
  count: number
}

export interface PeriodStat {
  key: string
  label: string
  total: number
  byType: TypeCount[]
  names: string[]
}

export interface StatsSummary {
  totalFinished: number
  thisMonth: number
  thisYear: number
  watching: number
  want: number
}

function emptyByType(): Record<MediaType, number> {
  return { anime: 0, tv: 0, movie: 0, comic: 0, book: 0 }
}

export function getCompletionDate(item: MediaItem): string | null {
  if (item.status !== 'finished') return null
  const raw = item.date || item.startDate
  if (!raw || !dayjs(raw).isValid()) return null
  return raw
}

export function groupFinishedByPeriod(
  items: MediaItem[],
  period: StatsPeriod,
): PeriodStat[] {
  const map = new Map<string, { byType: Record<MediaType, number>; names: string[] }>()

  for (const item of items) {
    const dateStr = getCompletionDate(item)
    if (!dateStr) continue

    const d = dayjs(dateStr)
    const key = period === 'month' ? d.format('YYYY-MM') : d.format('YYYY')

    if (!map.has(key)) {
      map.set(key, { byType: emptyByType(), names: [] })
    }
    const entry = map.get(key)!
    entry.byType[item.type]++
    entry.names.push(item.name)
  }

  const results: PeriodStat[] = []
  for (const [key, data] of map) {
    const label =
      period === 'month' ? dayjs(`${key}-01`).format('YYYY年M月') : `${key}年`
    const byType = MEDIA_TYPES.map((t) => ({
      type: t.value,
      label: t.label,
      count: data.byType[t.value],
    })).filter((x) => x.count > 0)
    const total = byType.reduce((sum, x) => sum + x.count, 0)
    results.push({ key, label, total, byType, names: data.names })
  }

  return results.sort((a, b) => b.key.localeCompare(a.key))
}

export function getStatsSummary(items: MediaItem[]): StatsSummary {
  const now = dayjs()
  const monthKey = now.format('YYYY-MM')
  const yearKey = now.format('YYYY')

  let totalFinished = 0
  let thisMonth = 0
  let thisYear = 0
  let watching = 0
  let want = 0

  for (const item of items) {
    if (item.status === 'want') want++
    else if (item.status === 'watching') watching++
    else if (item.status === 'finished') {
      totalFinished++
      const d = getCompletionDate(item)
      if (d) {
        const parsed = dayjs(d)
        if (parsed.format('YYYY-MM') === monthKey) thisMonth++
        if (parsed.format('YYYY') === yearKey) thisYear++
      }
    }
  }

  return { totalFinished, thisMonth, thisYear, watching, want }
}

export function getMaxPeriodTotal(stats: PeriodStat[]): number {
  if (!stats.length) return 1
  return Math.max(...stats.map((s) => s.total), 1)
}
