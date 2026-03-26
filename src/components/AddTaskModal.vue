<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, required: true },
  defaultColumnId: { type: String, default: null }
})

const emit = defineEmits(['close', 'confirm'])

const title = ref('')
const description = ref('')
const priority = ref('medium')
const dueDate = ref('')
const columnId = ref('todo')
const titleError = ref(false)

watch(() => props.visible, (val) => {
  if (val) {
    title.value = ''
    description.value = ''
    priority.value = 'medium'
    dueDate.value = ''
    titleError.value = false
    columnId.value = props.defaultColumnId ?? 'todo'
  }
})

function handleConfirm() {
  if (!title.value.trim()) {
    titleError.value = true
    return
  }
  emit('confirm', {
    title: title.value.trim(),
    description: description.value.trim(),
    priority: priority.value,
    dueDate: dueDate.value,
    columnId: columnId.value,
  })
}

function handleOverlayClick(e) {
  if (e.target.classList.contains('modal-overlay')) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-box" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h2>新建任务</h2>
            <button class="modal-close" @click="emit('close')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="form-group" :class="{ error: titleError }">
              <label>任务标题 <span class="required">*</span></label>
              <input
                v-model="title"
                placeholder="请输入任务标题"
                @input="titleError = false"
                @keyup.enter="handleConfirm"
                autofocus
              />
              <span v-if="titleError" class="error-msg">标题不能为空</span>
            </div>

            <div class="form-group">
              <label>任务描述</label>
              <textarea v-model="description" placeholder="可选，描述任务详情..." rows="3"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>优先级</label>
                <div class="priority-selector">
                  <button
                    v-for="p in ['high','medium','low']"
                    :key="p"
                    class="priority-btn"
                    :class="[`p-${p}`, { active: priority === p }]"
                    @click="priority = p"
                  >
                    {{ p === 'high' ? '高' : p === 'medium' ? '中' : '低' }}
                  </button>
                </div>
              </div>
              <div class="form-group">
                <label>截止日期</label>
                <input type="date" v-model="dueDate" />
              </div>
            </div>

            <div class="form-group">
              <label>所属列</label>
              <div class="column-selector">
                <button
                  v-for="col in [{ id: 'todo', label: '待办' }, { id: 'in-progress', label: '进行中' }, { id: 'done', label: '已完成' }]"
                  :key="col.id"
                  class="col-btn"
                  :class="{ active: columnId === col.id }"
                  @click="columnId = col.id"
                >
                  {{ col.label }}
                </button>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="emit('close')">取消</button>
            <button class="btn-confirm" @click="handleConfirm">创建任务</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}
.modal-box {
  background: var(--modal-bg);
  border-radius: 18px;
  width: 100%;
  max-width: 480px;
  border: 1px solid var(--column-border);
  box-shadow: 0 24px 64px rgba(0,0,0,0.4);
  overflow: hidden;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--column-border);
}
.modal-header h2 { font-size: 17px; font-weight: 700; color: var(--text-primary); margin: 0; }
.modal-close { background: none; border: none; cursor: pointer; color: var(--text-muted); display: flex; padding: 4px; border-radius: 6px; transition: color 0.15s, background 0.15s; }
.modal-close:hover { color: #ff5f6d; background: rgba(255,95,109,0.12); }
.modal-close svg { width: 16px; height: 16px; }
.modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
.form-row { display: flex; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.form-group label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
.required { color: #ff5f6d; }
.form-group.error input { border-color: #ff5f6d; }
.error-msg { font-size: 11px; color: #ff5f6d; }
.form-group input, .form-group textarea { background: var(--input-bg); border: 1.5px solid var(--card-border); border-radius: 10px; padding: 10px 13px; font-size: 14px; color: var(--text-primary); font-family: inherit; transition: border-color 0.15s; resize: none; outline: none; }
.form-group input:focus, .form-group textarea:focus { border-color: var(--accent); }
.form-group input[type="date"] { color-scheme: dark; }
.priority-selector, .column-selector { display: flex; gap: 8px; }
.priority-btn, .col-btn { flex: 1; padding: 7px 4px; border-radius: 8px; border: 1.5px solid var(--card-border); background: var(--input-bg); color: var(--text-muted); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: inherit; }
.priority-btn.p-high.active { border-color: #ff5f6d; background: rgba(255,95,109,0.15); color: #ff5f6d; }
.priority-btn.p-medium.active { border-color: #f7971e; background: rgba(247,151,30,0.15); color: #f7971e; }
.priority-btn.p-low.active { border-color: #43cea2; background: rgba(67,206,162,0.15); color: #43cea2; }
.priority-btn:hover, .col-btn:hover { border-color: var(--accent); color: var(--accent); }
.col-btn.active { border-color: var(--accent); background: rgba(99,179,237,0.15); color: var(--accent); }
.modal-footer { display: flex; gap: 10px; justify-content: flex-end; padding: 16px 24px 20px; border-top: 1px solid var(--column-border); }
.btn-cancel, .btn-confirm { padding: 9px 22px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; }
.btn-cancel { background: none; border: 1.5px solid var(--card-border); color: var(--text-muted); }
.btn-cancel:hover { border-color: var(--text-muted); color: var(--text-primary); }
.btn-confirm { background: var(--accent); border: 1.5px solid var(--accent); color: #0d1117; }
.btn-confirm:hover { filter: brightness(1.1); }
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-box, .modal-leave-to .modal-box { transform: scale(0.95) translateY(10px); }
</style>