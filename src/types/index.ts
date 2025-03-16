export interface Task {
  name: string
  timeSpent: number
}

export interface Break {
  taskName: string
  timeSpent: number
}

export interface DayData {
  date: string
  tasks: Task[]
  breaks: Break[]
}

export interface AppData {
  currentDay: string // Fecha actual en formato YYYY-MM-DD
  days: DayData[] // Historial de días
  currentTasks: Task[] // Tareas del día actual
  currentBreaks: Break[] // Descansos del día actual
}

