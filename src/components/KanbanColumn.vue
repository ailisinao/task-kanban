<script setup>
import { ref } from 'vue'
import TaskCard from './TaskCard.vue'

const props = defineProps({
  column: { type: Object, required: true }
})

const emit = defineEmits(['deleteTask', 'drop', 'addTask'])

const isDragOver = ref(false)

function handleDragOver(e) {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
  isDragOver.value = true
}

function handleDragLeave(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  if (
    e.clientX < rect.left || e.clientX > rect.right ||
    e.clientY < rect.top  || e.clientY > rect.bottom
  ) {
    isDragOver.value = false
  }
}

function handleDrop(e) {
  e.preventDefault()
  isDragOver.value = false
  const taskId = e.dataTransfer.getData('taskId')
  if (taskId) {
    emit('drop', taskId, props.column.id)
  }
}

const columnMeta = {
  'todo':        { color: '#6c8ebf' },
  'in-progress': { color: '#d6a520' },
  'done':        { color: '#43cea2' },
}
</script>

<template>
  <div
    class="kanban-column"
    :class="{ 'drag-over': isDragOver }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <div class="column-header">
      <div class="header-left">
        <span class="column-dot" :style="{ background: columnMeta[column.id]?.color }"></span>
        <h2 class="column-title">{{ column.title }}</h2>
        <span class="task-count">{{ column.tasks.length }}</span>
      </div>
      <button class="add-btn" @click="emit('addTask', column.id)" title="添加任务">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 5v14M5 12h14" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    <div class="tasks-list">
      <TaskCard
        v-for="task in column.tasks"
        :key="task.id"
        :task="task"
        @delete="emit('deleteTask', $event)"
      />
      <div v-if="column.tasks.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <path d="M9 12h6M12 9v6" stroke-linecap="round" opacity="0.5"/>
        </svg>
        <p>暂无任务</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kanban-column {
  background: var(--column-bg);
  border-radius: 16px;
  padding: 20px 16px;
  min-width: 280px;
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1.5px solid var(--column-border);
  transition: border-color 0.2s, box-shadow 0.2s;
  min-height: 200px;
}
.kanban-column.drag-over {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(99, 179, 237, 0.18);
  background: var(--column-hover-bg);
}
.column-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.header-left { display: flex; align-items: center; gap: 8px; }
.column-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.column-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 0; letter-spacing: 0.02em; }
.task-count { font-size: 12px; font-weight: 600; background: var(--count-bg); color: var(--text-muted); padding: 1px 8px; border-radius: 20px; min-width: 22px; text-align: center; }
.add-btn { background: none; border: 1.5px solid var(--card-border); cursor: pointer; padding: 4px; color: var(--text-muted); display: flex; align-items: center; justify-content: center; border-radius: 8px; width: 28px; height: 28px; transition: color 0.15s, background 0.15s, border-color 0.15s; }
.add-btn:hover { color: var(--accent); border-color: var(--accent); background: rgba(99,179,237,0.1); }
.add-btn svg { width: 15px; height: 15px; }
.tasks-list { display: flex; flex-direction: column; flex: 1; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 16px; gap: 8px; opacity: 0.4; }
.empty-state p { font-size: 13px; color: var(--text-muted); margin: 0; }
.empty-icon { width: 36px; height: 36px; color: var(--text-muted); }
</style>
