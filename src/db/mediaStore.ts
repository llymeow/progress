import { openDB } from 'idb'
import type { MediaItem } from '@/types/media'
import { migrateLegacyItem } from '@/types/media'

const DB_NAME = 'task-progress-db'
const STORE_NAME = 'tasks'

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' })
    }
  },
})

function normalizeItem(item: Record<string, unknown>): MediaItem {
  return migrateLegacyItem(item)
}

export async function fetchMediaItems(): Promise<MediaItem[]> {
  const db = await dbPromise
  const raw = await db.getAll(STORE_NAME)
  return raw.map((item) => normalizeItem(item as Record<string, unknown>))
}

export async function createMediaItem(item: Omit<MediaItem, 'id'>): Promise<MediaItem> {
  const db = await dbPromise
  const newItem: MediaItem = {
    ...item,
    id: Date.now().toString(),
  }
  await db.add(STORE_NAME, newItem)
  return newItem
}

export async function updateMediaItem(item: MediaItem): Promise<MediaItem> {
  const db = await dbPromise
  await db.put(STORE_NAME, item)
  return item
}

export async function deleteMediaItem(id: string): Promise<void> {
  const db = await dbPromise
  await db.delete(STORE_NAME, id)
}

if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then((granted) => {
    if (granted) {
      console.log('✅ 数据存储将被持久保留')
    } else {
      console.log('⚠️ 数据可能被浏览器清除')
    }
  })
}
