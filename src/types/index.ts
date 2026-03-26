export type Priority = 'high' | 'medium' | 'low'

export type ColumnId = 'todo' | 'in-progress' | 'done'

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  dueDate: string
  columnId: ColumnId
  createdAt: number
}

export interface Column {
  id: ColumnId
  title: string
  tasks: Task[]
}
