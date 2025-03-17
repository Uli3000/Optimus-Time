import type { AppData, DayData } from "../types"

const STORAGE_KEY = "pomodoro_app_data"

export const getCurrentDate = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export const initializeAppData = (): AppData => {
  const currentDate = getCurrentDate()

  return {
    currentDay: currentDate,
    days: [],
    currentTasks: [],
    currentBreaks: [],
  }
}

export const saveAppData = (data: AppData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const loadAppData = (): AppData => {
  const storedData = localStorage.getItem(STORAGE_KEY)

  if (!storedData) {
    const newData = initializeAppData()
    saveAppData(newData)
    return newData
  }

  try {
    const parsedData = JSON.parse(storedData) as AppData

    // Verificar si es un nuevo día
    const currentDate = getCurrentDate()
    if (parsedData.currentDay !== currentDate) {
      // Si las tareas actuales no están vacías, guardarlas en el historial
      if (parsedData.currentTasks.length > 0 || parsedData.currentBreaks.length > 0) {
        // Buscar si ya existe una entrada para el día anterior
        const existingDayIndex = parsedData.days.findIndex((day) => day.date === parsedData.currentDay)

        if (existingDayIndex >= 0) {
          // Si ya existe, actualizar esa entrada
          const existingDay = parsedData.days[existingDayIndex]

          // Combinar tareas
          const updatedTasks = [...existingDay.tasks]
          parsedData.currentTasks.forEach((currentTask) => {
            const existingTaskIndex = updatedTasks.findIndex((task) => task.name === currentTask.name)

            if (existingTaskIndex >= 0) {
              updatedTasks[existingTaskIndex] = {
                ...updatedTasks[existingTaskIndex],
                timeSpent: updatedTasks[existingTaskIndex].timeSpent + currentTask.timeSpent,
              }
            } else {
              updatedTasks.push(currentTask)
            }
          })

          // Combinar descansos
          const updatedBreaks = [...existingDay.breaks]
          parsedData.currentBreaks.forEach((currentBreak) => {
            const existingBreakIndex = updatedBreaks.findIndex(
              (breakItem) => breakItem.taskName === currentBreak.taskName,
            )

            if (existingBreakIndex >= 0) {
              updatedBreaks[existingBreakIndex] = {
                ...updatedBreaks[existingBreakIndex],
                timeSpent: updatedBreaks[existingBreakIndex].timeSpent + currentBreak.timeSpent,
              }
            } else {
              updatedBreaks.push(currentBreak)
            }
          })

          // Actualizar el día existente
          parsedData.days[existingDayIndex] = {
            ...existingDay,
            tasks: updatedTasks,
            breaks: updatedBreaks,
          }
        } else {
          // Si no existe, crear una nueva entrada
          const previousDay: DayData = {
            date: parsedData.currentDay,
            tasks: parsedData.currentTasks,
            breaks: parsedData.currentBreaks,
          }

          parsedData.days.push(previousDay)
        }
      }

      // Actualizar al día actual y limpiar las tareas actuales
      parsedData.currentDay = currentDate
      parsedData.currentTasks = []
      parsedData.currentBreaks = []

      // Guardar los cambios
      saveAppData(parsedData)
    }

    return parsedData
  } catch (error) {
    console.error("Error parsing stored data:", error)
    const newData = initializeAppData()
    saveAppData(newData)
    return newData
  }
}

export const finishCurrentDay = (data: AppData): AppData => {
  if (data.currentTasks.length === 0 && data.currentBreaks.length === 0) {
    return data
  }

  const existingDayIndex = data.days.findIndex((day) => day.date === data.currentDay)

  const updatedDays = [...data.days]

  if (existingDayIndex >= 0) {
    // Si ya existe una entrada para hoy, reemplazarla con los datos actuales
    updatedDays[existingDayIndex] = {
      date: data.currentDay,
      tasks: [...data.currentTasks],
      breaks: [...data.currentBreaks],
    }
  } else {
    const newDayData: DayData = {
      date: data.currentDay,
      tasks: data.currentTasks,
      breaks: data.currentBreaks,
    }

    updatedDays.push(newDayData)
  }

  const updatedData: AppData = {
    ...data,
    days: updatedDays,
  }

  saveAppData(updatedData)

  return updatedData
}

export const startNewDay = (data: AppData): AppData => {
  const updatedData: AppData = {
    ...data,
    currentTasks: [],
    currentBreaks: [],
  }

  saveAppData(updatedData)

  return updatedData
}

export const getCurrentDayData = (data: AppData): { tasks: DayData["tasks"]; breaks: DayData["breaks"] } => {
  const existingDayIndex = data.days.findIndex((day) => day.date === data.currentDay)

  if (existingDayIndex >= 0) {
    // Si existe una entrada en el historial para hoy, devolvemos solo esa entrada
    const existingDay = data.days[existingDayIndex]

    return {
      tasks: existingDay.tasks,
      breaks: existingDay.breaks,
    }
  }

  // Si no hay entrada en el historial, devolver solo las tareas y descansos actuales
  return {
    tasks: data.currentTasks,
    breaks: data.currentBreaks,
  }
}
