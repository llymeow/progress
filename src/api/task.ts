import axios from 'axios'

// const BASE_URL = 'http://localhost:3000/api/tasks'
const BASE_URL = '/api/tasks'

export interface Task {
  id?: string
  name: string
  total: number
  done: number
  color: string
  date: string | null
}

export const fetchTasks = () => axios.get<Task[]>(BASE_URL)

export const createTask = (task: Task) => axios.post<Task>(BASE_URL, task)

export const updateTask = (task: Task) => axios.put<Task>(`${BASE_URL}/${task.id}`, task)

export const deleteTask = (id: string) => axios.delete(`${BASE_URL}/${id}`)
