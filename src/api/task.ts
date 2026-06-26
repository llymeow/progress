import axios from 'axios'
import type { MediaItem } from '@/types/media'

const BASE_URL = '/api/media'

export type { MediaItem }
export type Task = MediaItem

export const fetchMediaItems = () => axios.get<MediaItem[]>(BASE_URL)

export const createMediaItem = (item: MediaItem) => axios.post<MediaItem>(BASE_URL, item)

export const updateMediaItem = (item: MediaItem) =>
  axios.put<MediaItem>(`${BASE_URL}/${item.id}`, item)

export const deleteMediaItem = (id: string) => axios.delete(`${BASE_URL}/${id}`)

// 兼容旧 API 名称
export const fetchTasks = fetchMediaItems
export const createTask = createMediaItem
export const updateTask = updateMediaItem
export const deleteTask = deleteMediaItem
