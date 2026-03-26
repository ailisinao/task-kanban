<script setup>
import { ref, watch } from 'vue'
import KanbanColumn from './components/KanbanColumn.vue'
import AddTaskModal from './components/AddTaskModal.vue'

const STORAGE_KEY = 'kanban-tasks'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function loadColumns() {
  const defaultColumns = [
    { id: 'todo', title: '待办', tasks: [] },
    { id: 'in-progress', title: '进行中', tasks: [] },
    { id: 'done', title: '已完成', tasks: [] },
  ]
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const tasks = JSON.parse(saved)
      defaultColumns.forEach(col => {
        col.tasks = tasks
          .filter(t => t.columnId === col.id)
          .sort((a, b) => a.createdAt - b.createdAt)
      })
    }
  } catch {
    // ignore parse errors
  }
  return defaultColumns
}

const columns = ref(loadColumns())

watch(columns, () => {
  const allTasks = columns.value.flatMap(col => col.tasks)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allTasks))
}, { deep: true })

const modalVisible = ref(false)
const modalDefaultColumn = ref(null)

function openModal(columnId) {
  modalDefaultColumn.value = columnId
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

function handleAddTask(data) {
  const task = {
    id: generateId(),
    title: data.title,
    description: data.description,
    priority: data.priority,
    dueDate: data.dueDate,
    columnId: data.columnId,
    createdAt: Date.now(),
  }
  const col = columns.value.find(c => c.id === data.columnId)
  if (col) col.tasks.push(task)
  closeModal()
}

function handleDeleteTask(taskId) {
  for (const col of columns.value) {
    const idx = col.tasks.findIndex(t => t.id === taskId)
    if (idx !== -1) {
      col.tasks.splice(idx, 1)
      return
    }
  }
}

function handleDrop(taskId, targetColumnId) {
  let task
  for (const col of columns.value) {
    const idx = col.tasks.findIndex(t => t.id === taskId)
    if (idx !== -1) {
      if (col.id === targetColumnId) return
      task = col.tasks.splice(idx, 1)[0]
      break
    }
  }
  if (task) {
    task.columnId = targetColumnId
    const targetCol = columns.value.find(c => c.id === targetColumnId)
    if (targetCol) targetCol.tasks.push(task)
  }
}

const totalTasks = () => columns.value.reduce((sum, c) => sum + c.tasks.length, 0)
const doneTasks = () => columns.value.find(c => c.id === 'done')?.tasks.length ?? 0
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="header-inner">
        <div class="brand">
          <span class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="9" rx="1.5"/>
              <rect x="14" y="3" width="7" height="5" rx="1.5"/>
              <rect x="14" y="12" width="7" height="9" rx="1.5"/>
              <rect x="3" y="16" width="7" height="5" rx="1.5"/>
            </svg>
          </span>
          <div>
            <h1>任务看板</h1>
            <p class="brand-sub">Task Kanban Board</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat">
            <span class="stat-num">{{ totalTasks() }}</span>
            <span class="stat-label">总任务</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-num done-num">{{ doneTasks() }}</span>
            <span class="stat-label">已完成</span>
          </div>
        </div>
        <button class="new-task-btn" @click="openModal('todo')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 5v14M5 12h14" stroke-linecap="round"/>
          </svg>
          新建任务
        </button>
      </div>
    </header>

    <main class="board">
      <KanbanColumn
        v-for="col in columns"
        :key="col.id"
        :column="col"
        @add-task="openModal"
        @delete-task="handleDeleteTask"
        @drop="handleDrop"
      />
    </main>

    <AddTaskModal
      :visible="modalVisible"
      :default-column-id="modalDefaultColumn"
      @close="closeModal"
      @confirm="handleAddTask"
    />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.app-header {
  border-bottom: 1px solid var(--column-border);
  background: var(--header-bg);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 28px;
  height: 68px;
  display: flex;
  align-items: center;
  gap: 20px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}
.brand-icon {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #63b3ed 0%, #4299e1 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.brand-icon svg { width: 20px; height: 20px; stroke: #0d1117; }
.brand h1 {
  font-size: 18px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.02em;
}
.brand-sub {
  font-size: 11px;
  color: var(--text-muted);
  margin: 0;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.header-stats { display: flex; align-items: center; gap: 16px; }
.stat { display: flex; flex-direction: column; align-items: center; gap: 1px; }
.stat-num { font-size: 20px; font-weight: 800; color: var(--text-primary); line-height: 1; }
.done-num { color: #43cea2; }
.stat-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
.stat-divider { width: 1px; height: 28px; background: var(--column-border); }
.new-task-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--accent);
  color: #0d1117;
  border: none;
  border-radius: 10px;
  padding: 9px 18px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: filter 0.15s, transform 0.1s;
  white-space: nowrap;
}
.new-task-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
.new-task-btn:active { transform: translateY(0); }
.new-task-btn svg { width: 16px; height: 16px; }
.board {
  flex: 1;
  display: flex;
  gap: 20px;
  padding: 28px;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  align-items: flex-start;
  box-sizing: border-box;
}
@media (max-width: 768px) {
  .header-inner { padding: 0 16px; gap: 12px; }
  .header-stats { display: none; }
  .board { flex-direction: column; padding: 16px; }
  .brand-sub { display: none; }
}
</style>
