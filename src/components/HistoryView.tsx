import { motion } from "framer-motion"
import type { DayData } from "../types"
import { useState } from "react"

interface HistoryViewProps {
  days: DayData[]
  onBack: () => void
}

export default function HistoryView({ days, onBack }: HistoryViewProps) {
  const [selectedDay, setSelectedDay] = useState<DayData | null>(days.length > 0 ? days[days.length - 1] : null)

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else {
      return `${minutes}m ${secs}s`
    }
  }

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number)
    const date = new Date(year, month - 1, day)
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const sortedDays = [...days].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-center">
        <div className="px-4 py-1.5 text-sm bg-[#2a1b3e] text-[#c4b5fd] rounded-full inline-flex items-center gap-2 border border-[#c4b5fd]/20">
          <span className="w-1.5 h-1.5 bg-[#c4b5fd] rounded-full"></span>
          Historial
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
        Tu <span className="text-[#c4b5fd]">progreso</span> diario
      </h1>

      <div className="space-y-6">
        <div className="flex overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-[#c4b5fd]/20 scrollbar-track-transparent">
          <div className="flex gap-2">
            {sortedDays.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 whitespace-nowrap rounded-lg border transition-colors ${
                  selectedDay?.date === day.date
                    ? "bg-[#c4b5fd]/20 border-[#c4b5fd]/30 text-white"
                    : "bg-[#2a1b3e] border-[#c4b5fd]/10 text-[#c4b5fd]/70 hover:bg-[#2a1b3e]/80"
                }`}
              >
                {formatDate(day.date)}
              </button>
            ))}
          </div>
        </div>

        {selectedDay && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#2a1b3e] p-6 rounded-lg border border-[#c4b5fd]/10">
                <p className="text-[#c4b5fd]/70 text-sm">Tiempo de Trabajo</p>
                <p className="text-2xl font-bold text-white mt-2">
                  {formatTime(selectedDay.tasks.reduce((acc, task) => acc + task.timeSpent, 0))}
                </p>
              </div>

              <div className="bg-[#2a1b3e] p-6 rounded-lg border border-[#c4b5fd]/10">
                <p className="text-[#c4b5fd]/70 text-sm">Tiempo de Descanso</p>
                <p className="text-2xl font-bold text-white mt-2">
                  {formatTime(selectedDay.breaks.reduce((acc, breakItem) => acc + breakItem.timeSpent, 0))}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium text-[#c4b5fd]">Detalles por Tarea</h2>

              {selectedDay.tasks.length > 0 ? (
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
                  {selectedDay.tasks.map((task, index) => (
                    <motion.div
                      key={index}
                      variants={item}
                      className="bg-[#2a1b3e] p-4 rounded-lg border border-[#c4b5fd]/10"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-white">{task.name}</h3>
                        <span className="text-[#c4b5fd]">{formatTime(task.timeSpent)}</span>
                      </div>

                      {selectedDay.breaks.some((b) => b.taskName === task.name) && (
                        <div className="mt-2 text-sm text-[#c4b5fd]/70">
                          <span className="text-white">Descanso:</span>{" "}
                          {formatTime(
                            selectedDay.breaks
                              .filter((b) => b.taskName === task.name)
                              .reduce((acc, b) => acc + b.timeSpent, 0),
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <p className="text-[#c4b5fd]/50 text-center py-8 bg-[#2a1b3e] rounded-lg border border-[#c4b5fd]/10">
                  No hay tareas registradas
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onBack}
        className="w-full py-4 bg-white hover:opacity-90 text-[#1a0b2e] font-medium rounded-lg transition-opacity border border-white/5"
      >
        Volver al Temporizador
      </button>
    </motion.div>
  )
}
