import dayjs from 'dayjs'
import type { MediaItem } from '@/types/media'
import { MEDIA_TYPES, MEDIA_STATUSES } from '@/types/media'

export const EXPORT_VERSION = 1
export type ExportFormat = 'json' | 'csv'
export type ExportResult = 'shared' | 'downloaded' | 'opened' | 'cancelled'

function getTypeLabel(type: string) {
  return MEDIA_TYPES.find((t) => t.value === type)?.label ?? type
}

function getStatusLabel(status: string) {
  return MEDIA_STATUSES.find((s) => s.value === status)?.label ?? status
}

function escapeCsv(value: string | number | null | undefined) {
  const str = value == null ? '' : String(value)
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function sortedItems(items: MediaItem[]) {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

function isIos() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

async function saveFile(
  content: string,
  filename: string,
  mimeType: string,
  withBom = false,
): Promise<ExportResult> {
  const blob = new Blob([withBom ? `\ufeff${content}` : content], { type: mimeType })
  const file = new File([blob], filename, { type: mimeType })

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename })
      return 'shared'
    } catch (error) {
      if ((error as Error).name === 'AbortError') return 'cancelled'
    }
  }

  const url = URL.createObjectURL(blob)

  if (isIos()) {
    const opened = window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
    if (opened) return 'opened'
  }

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 1000)

  return 'downloaded'
}

export async function exportMediaAsJson(items: MediaItem[]): Promise<ExportResult> {
  const payload = {
    version: EXPORT_VERSION,
    exportedAt: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    items: sortedItems(items),
  }
  const date = dayjs().format('YYYY-MM-DD')
  return saveFile(
    JSON.stringify(payload, null, 2),
    `书影音-${date}.json`,
    'application/json;charset=utf-8',
  )
}

export async function exportMediaAsCsv(items: MediaItem[]): Promise<ExportResult> {
  const headers = ['名称', '类型', '状态', '当前进度', '总量', '开始日期', '完成日期']
  const rows = sortedItems(items).map((item) =>
    [
      item.name,
      getTypeLabel(item.type),
      getStatusLabel(item.status),
      item.done,
      item.total,
      item.startDate ?? '',
      item.date ?? '',
    ]
      .map(escapeCsv)
      .join(','),
  )
  const date = dayjs().format('YYYY-MM-DD')
  return saveFile(
    [headers.join(','), ...rows].join('\n'),
    `书影音-${date}.csv`,
    'text/csv;charset=utf-8',
    true,
  )
}

export async function exportMedia(
  items: MediaItem[],
  format: ExportFormat,
): Promise<ExportResult> {
  if (format === 'json') return exportMediaAsJson(items)
  return exportMediaAsCsv(items)
}

export function getExportSuccessMessage(result: ExportResult): string {
  switch (result) {
    case 'shared':
      return '已打开分享面板，可选择「存储到文件」保存'
    case 'opened':
      return '已在新页面打开，点分享可保存到文件'
    case 'downloaded':
      return '导出成功，请查看下载目录'
    default:
      return ''
  }
}
