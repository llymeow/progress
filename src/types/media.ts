export type MediaType = 'comic' | 'movie' | 'tv' | 'anime'
export type MediaStatus = 'want' | 'watching' | 'finished'

export interface MediaItem {
  id?: string
  name: string
  type: MediaType
  status: MediaStatus
  total: number
  done: number
  color: string
  startDate: string | null
  date: string | null
  order?: number
}

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  comic: '漫',
  movie: '影',
  tv: '剧',
  anime: '动',
}

export const MEDIA_STATUS_LABELS: Record<MediaStatus, string> = {
  want: '想看',
  watching: '在看',
  finished: '看过',
}

export const MEDIA_TYPES: { value: MediaType; label: string }[] = [
  { value: 'comic', label: '漫画' },
  { value: 'anime', label: '动画' },
  { value: 'movie', label: '电影' },
  { value: 'tv', label: '剧集' },
]

export const MEDIA_STATUSES: { value: MediaStatus; label: string }[] = [
  { value: 'want', label: '想看' },
  { value: 'watching', label: '在看' },
  { value: 'finished', label: '看过' },
]

export function getTotalLabel(type: MediaType): string {
  if (type === 'comic') return '总话数'
  if (type === 'tv' || type === 'anime') return '总集数'
  return '整部'
}

export function getDoneLabel(type: MediaType): string {
  if (type === 'comic') return '当前话数'
  if (type === 'tv' || type === 'anime') return '当前集数'
  return '已观看'
}

export function getProgressUnit(type: MediaType): string {
  if (type === 'comic') return '话'
  if (type === 'tv' || type === 'anime') return '集'
  return ''
}

export function defaultTotal(type: MediaType): number {
  if (type === 'comic') return 200
  if (type === 'tv') return 12
  if (type === 'anime') return 12
  return 1
}

const VALID_TYPES: MediaType[] = ['comic', 'movie', 'tv', 'anime']

function normalizeType(raw: unknown): MediaType {
  if (raw === 'book') return 'comic'
  if (VALID_TYPES.includes(raw as MediaType)) return raw as MediaType
  return 'comic'
}

export function migrateLegacyItem(item: Record<string, unknown>): MediaItem {
  const done = Number(item.done ?? 0)
  const total = Number(item.total ?? 10)
  let status: MediaStatus = 'want'

  if (item.status === 'want' || item.status === 'watching' || item.status === 'finished') {
    status = item.status
  } else if (done >= total && total > 0) {
    status = 'finished'
  } else if (done > 0) {
    status = 'watching'
  }

  return {
    id: item.id as string | undefined,
    name: String(item.name ?? ''),
    type: normalizeType(item.type),
    status,
    total,
    done,
    color: String(item.color ?? '#007aff'),
    startDate: (item.startDate as string | null) ?? null,
    date: (item.date as string | null) ?? null,
    order: Number(item.order ?? 0),
  }
}
