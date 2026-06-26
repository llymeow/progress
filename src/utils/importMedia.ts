import type { MediaItem } from '@/types/media'
import { migrateLegacyItem } from '@/types/media'

export class ImportMediaError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ImportMediaError'
  }
}

function normalizeImportedItem(raw: Record<string, unknown>, index: number): MediaItem {
  const item = migrateLegacyItem(raw)
  if (!item.name.trim()) {
    throw new ImportMediaError(`第 ${index + 1} 条记录缺少名称`)
  }
  if (!item.total || item.total <= 0) {
    throw new ImportMediaError(`「${item.name}」的总量无效`)
  }
  return {
    ...item,
    id: item.id || `${Date.now()}-${index}`,
    order: item.order ?? index,
  }
}

export function parseImportJson(text: string): MediaItem[] {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new ImportMediaError('文件不是有效的 JSON 格式')
  }

  const rawItems = Array.isArray(data)
    ? data
    : (data as { items?: unknown })?.items

  if (!Array.isArray(rawItems)) {
    throw new ImportMediaError('未找到可导入的记录列表')
  }

  if (rawItems.length === 0) {
    throw new ImportMediaError('文件中没有记录')
  }

  return rawItems.map((item, index) =>
    normalizeImportedItem(item as Record<string, unknown>, index),
  )
}

export async function readImportFile(file: File): Promise<MediaItem[]> {
  if (!file.name.endsWith('.json') && file.type !== 'application/json') {
    throw new ImportMediaError('请选择 JSON 文件')
  }
  const text = await file.text()
  return parseImportJson(text)
}
