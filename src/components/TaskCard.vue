<script setup>
const props = defineProps({
  task: { type: Object, required: true }
})

const emit = defineEmits(['delete', 'dragStart'])

function handleDragStart(e) {
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('taskId', props.task.id)
  emit('dragStart', props.task)
}

function handleDelete() {
  emit('delete', props.task.id)
}

function priorityLabel(p) {
  return p === 'high' ? '高' : p === 'medium' ? '中' : '低'
}
</script>

<template>
  <div
    class="task-card"
    :class="`priority-${task.priority}`"
    draggable="true"
    @dragstart="handleDragStart"
  >
    <div class="card-header">
      <span class="priority-badge" :class="`badge-${task.priority}`">
        {{ priorityLabel(task.priority) }}
      </span>
      <button class="delete-btn" @click="handleDelete" title="删除任务">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    <h3 class="card-title">{{ task.title }}</h3>
    <p v-if="task.description" class="card-desc">{{ task.description }}</p>
    <div v-if="task.dueDate" class="card-footer">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="cal-icon">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18" stroke-linecap="round"/>
      </svg>
      <span>{{ task.dueDate }}</span>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 10px;
  cursor: grab;
  border: 1.5px solid var(--card-border);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  position: relative;
  user-select: none;
}
.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  border-color: var(--accent);
}
.task-card:active { cursor: grabbing; transform: scale(0.97); }
.task-card.priority-high   { border-left: 4px solid #ff5f6d; }
.task-card.priority-medium { border-left: 4px solid #f7971e; }
.task-card.priority-low    { border-left: 4px solid #43cea2; }
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.priority-badge {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 2px 10px;
  border-radius: 20px;
  text-transform: uppercase;
}
.badge-high   { background: rgba(255,95,109,0.18); color: #ff5f6d; }
.badge-medium { background: rgba(247,151,30,0.18);  color: #f7971e; }
.badge-low    { background: rgba(67,206,162,0.18);  color: #43cea2; }
.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}
.delete-btn:hover { color: #ff5f6d; background: rgba(255,95,109,0.12); }
.delete-btn svg { width: 15px; height: 15px; }
.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 6px;
  line-height: 1.4;
}
.card-desc {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0 0 8px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-footer {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--text-muted);
}
.cal-icon { width: 13px; height: 13px; }
</style>
