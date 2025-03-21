import { motion } from "framer-motion"
import type { Task, Break } from "../types"
import { useTranslation } from "react-i18next"

interface DailySummaryProps {
  tasks: Task[]
  breaks: Break[]
  onNewDay: () => void
  onViewHistory?: () => void
}

export default function DailySummary({ tasks, breaks, onNewDay, onViewHistory }: DailySummaryProps) {
  const { t } = useTranslation();
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

  const totalTaskTime = tasks.reduce((acc, task) => acc + task.timeSpent, 0)
  const totalBreakTime = breaks.reduce((acc, breakItem) => acc + breakItem.timeSpent, 0)

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
          {t("summary")}
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
        {t("your")}<span className="text-[#c4b5fd]">{t("title2")}</span>{t("today")}
      </h1>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#2a1b3e] p-6 rounded-lg border border-[#c4b5fd]/10">
            <p className="text-[#c4b5fd]/70 text-sm">{t("working_time")}</p>
            <p className="text-2xl font-bold text-white mt-2">{formatTime(totalTaskTime)}</p>
          </div>

          <div className="bg-[#2a1b3e] p-6 rounded-lg border border-[#c4b5fd]/10">
            <p className="text-[#c4b5fd]/70 text-sm">{t("break_time")}</p>
            <p className="text-2xl font-bold text-white mt-2">{formatTime(totalBreakTime)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-[#c4b5fd]">{t("task_details")}</h2>

          {tasks.length > 0 ? (
            <motion.div className="space-y-3">
              {tasks.map((task, index) => (
                <motion.div key={index} className="bg-[#2a1b3e] p-4 rounded-lg border border-[#c4b5fd]/10">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-white">{task.name}</h3>
                    <span className="text-[#c4b5fd]">{formatTime(task.timeSpent)}</span>
                  </div>

                  {breaks.some((b) => b.taskName === task.name) && (
                    <div className="mt-2 text-sm text-[#c4b5fd]/70">
                      <span className="text-white">{t("break")}:</span>{" "}
                      {formatTime(
                        breaks.filter((b) => b.taskName === task.name).reduce((acc, b) => acc + b.timeSpent, 0),
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-[#c4b5fd]/50 text-center py-8 bg-[#2a1b3e] rounded-lg border border-[#c4b5fd]/10">
              {t("no_tasks")}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onNewDay}
          className="flex-1 py-4 bg-white hover:opacity-90 text-[#1a0b2e] font-medium rounded-lg transition-opacity border border-white/5 cursor-pointer"
        >
          {t("continue_working")}
        </button>

        {onViewHistory && (
          <button
            onClick={onViewHistory}
            className="flex-1 py-4 bg-[#2a1b3e] hover:bg-[#341d4e] text-[#c4b5fd] font-medium rounded-lg transition-colors border border-[#c4b5fd]/20 cursor-pointer"
          >
            {t("see_history")}
          </button>
        )}
      </div>
    </motion.div>
  )
}