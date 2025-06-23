// backend/server.js
const express = require('express')
const cors = require('cors')
const fs = require('fs-extra')
const path = require('path')

const app = express()
const PORT = 3000

const DATA_FILE = path.join(__dirname, 'tasks.json')

// 中间件
app.use(cors())
app.use(express.json())

// 读取任务
app.get('/api/tasks', async (req, res) => {
  const tasks = await fs.readJson(DATA_FILE)
  res.json(tasks)
})

// 新增任务
app.post('/api/tasks', async (req, res) => {
  const tasks = await fs.readJson(DATA_FILE)
  const newTask = { ...req.body, id: Date.now().toString() }
  tasks.push(newTask)
  await fs.writeJson(DATA_FILE, tasks, { spaces: 2 })
  res.status(201).json(newTask)
})

// 更新任务
app.put('/api/tasks/:id', async (req, res) => {
  const tasks = await fs.readJson(DATA_FILE)
  const id = req.params.id
  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) return res.status(404).json({ error: '任务未找到' })
  tasks[index] = { ...req.body, id }
  await fs.writeJson(DATA_FILE, tasks, { spaces: 2 })
  res.json(tasks[index])
})

// 删除任务
app.delete('/api/tasks/:id', async (req, res) => {
  let tasks = await fs.readJson(DATA_FILE)
  const id = req.params.id
  tasks = tasks.filter((t) => t.id !== id)
  await fs.writeJson(DATA_FILE, tasks, { spaces: 2 })
  res.status(204).end()
})

// 静态托管前端打包文件
app.use(express.static(path.join(__dirname, '../dist')))

// 所有非 API 路由都返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`✅ 任务后端已启动：http://localhost:${PORT}`)
})
