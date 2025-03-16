import { useState, useEffect } from "react"
import TaskTimer from "./components/TaskTimer"
import BreakTimer from "./components/BreakTimer"
import DailySummary from "./components/DailySummary"
import HistoryView from "./components/HistoryView"
import type { AppData } from "./types"
import { finishCurrentDay, getCurrentDayData, loadAppData, saveAppData, startNewDay } from "./utils/appUtils"

export default function PomodoroApp() {
  const [appData, setAppData] = useState<AppData | null>(null)
  const [currentTask, setCurrentTask] = useState("")
  const [showSummary, setShowSummary] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const data = loadAppData()
    setAppData(data)
  }, [])

  if (!appData) {
    return (
      <main className="min-h-screen bg-[#1a0b2e] flex flex-col items-center justify-center p-4">
        <div className="text-white">Cargando...</div>
      </main>
    )
  }

  const addTaskTime = (taskName: string, seconds: number) => {
    setAppData((prevData) => {
      if (!prevData) return null

      const updatedTasks = prevData.currentTasks.map((t) =>
        t.name === taskName ? { ...t, timeSpent: t.timeSpent + seconds } : t,
      )

      const newTasks = updatedTasks.some((t) => t.name === taskName)
        ? updatedTasks
        : [...updatedTasks, { name: taskName, timeSpent: seconds }]

      const updatedData = { ...prevData, currentTasks: newTasks }
      saveAppData(updatedData)
      return updatedData
    })
  }

  const addBreakTime = (taskName: string, seconds: number) => {
    setAppData((prevData) => {
      if (!prevData) return null

      const updatedBreaks = prevData.currentBreaks.map((b) =>
        b.taskName === taskName ? { ...b, timeSpent: b.timeSpent + seconds } : b,
      )

      const newBreaks = updatedBreaks.some((b) => b.taskName === taskName)
        ? updatedBreaks
        : [...updatedBreaks, { taskName, timeSpent: seconds }]

      const updatedData = { ...prevData, currentBreaks: newBreaks }
      saveAppData(updatedData)
      return updatedData
    })
  }

  const handleEndDay = () => {
    setAppData((prevData) => {
      if (!prevData) return null

      const existingDayIndex = prevData.days.findIndex((day) => day.date === prevData.currentDay)

      if (existingDayIndex >= 0) {
        const updatedDays = [...prevData.days]
        updatedDays.splice(existingDayIndex, 1)

        const cleanedData = {
          ...prevData,
          days: updatedDays,
        }

        return finishCurrentDay(cleanedData)
      }

      const updatedData = finishCurrentDay(prevData)
      return updatedData
    })

    setShowSummary(true)
  }

  const handleNewDay = () => {
    setAppData((prevData) => {
      if (!prevData) return null
      const updatedData = startNewDay(prevData)
      return updatedData
    })

    setShowSummary(false)
    setShowHistory(false)
    setCurrentTask("")
  }

  const handleViewHistory = () => {
    setShowHistory(true)
    setShowSummary(false)
  }

  const handleBackToTimer = () => {
    setShowHistory(false)
    setShowSummary(false)
  }

  const currentDayData = getCurrentDayData(appData)

  return (
    <main className="min-h-screen bg-[#1a0b2e] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md px-2 sm:px-0">
        {!showSummary && !showHistory ? (
          <div className="space-y-8">
            <div className="flex items-center justify-center">
              <div className="px-4 py-1.5 text-sm bg-[#2a1b3e] text-[#c4b5fd] rounded-full inline-flex items-center gap-2 border border-[#c4b5fd]/20">
                <span className="w-1.5 h-1.5 bg-[#c4b5fd] rounded-full"></span>
                Optimus Time
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white text-center">
              Optimiza tu <span className="text-[#c4b5fd]">productividad </span>
            </h1>

            <div className="border border-[#c4b5fd]/10 rounded-xl p-6 bg-[#231136]">
              <TaskTimer onTaskChange={setCurrentTask} onTimeComplete={addTaskTime} />
            </div>

            <div className="h-px bg-[#c4b5fd]/10 mx-4"></div>

            <div className="border border-[#c4b5fd]/10 rounded-xl p-6 bg-[#231136]">
              <BreakTimer taskName={currentTask} onTimeComplete={addBreakTime} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleEndDay}
                className="flex-1 py-4 bg-white hover:opacity-90 text-[#1a0b2e] font-medium rounded-lg transition-opacity border border-white/5"
              >
                Terminar Día
              </button>

              {appData.days.length > 0 && (
                <button
                  onClick={handleViewHistory}
                  className="flex-1 py-4 bg-[#2a1b3e] hover:bg-[#341d4e] text-[#c4b5fd] font-medium rounded-lg transition-colors border border-[#c4b5fd]/20"
                >
                  Ver Historial
                </button>
              )}
            </div>
          </div>
        ) : showSummary ? (
          <div className="border border-[#c4b5fd]/10 rounded-xl p-6 bg-[#231136]">
            <DailySummary
              tasks={currentDayData.tasks}
              breaks={currentDayData.breaks}
              onNewDay={handleNewDay}
              onViewHistory={appData.days.length > 0 ? handleViewHistory : undefined}
            />
          </div>
        ) : (
          <div className="border border-[#c4b5fd]/10 rounded-xl p-6 bg-[#231136]">
            <HistoryView days={appData.days} onBack={handleBackToTimer} />
          </div>
        )}
      </div>
    </main>
  )
}

