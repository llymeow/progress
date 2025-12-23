import { openDB } from 'idb'
import type { Task } from '@/api/task'

const DB_NAME = 'task-progress-db'
const STORE_NAME = 'tasks'

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' })
    }
  },
})

export async function fetchTasks(): Promise<Task[]> {
  const db = await dbPromise
  return await db.getAll(STORE_NAME)
}

export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
  const db = await dbPromise
  const newTask: Task = {
    ...task,
    id: Date.now().toString(),
  }
  await db.add(STORE_NAME, newTask)
  return newTask
}

export async function updateTask(task: Task): Promise<Task> {
  const db = await dbPromise
  await db.put(STORE_NAME, task)
  return task
}

export async function deleteTask(taskId: string): Promise<void> {
  const db = await dbPromise
  await db.delete(STORE_NAME, taskId)
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
