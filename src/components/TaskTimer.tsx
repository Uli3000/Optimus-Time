import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useAlert } from "./AlertDialog"
import { useTranslation } from "react-i18next"

interface TaskTimerProps {
  onTaskChange: (taskName: string) => void
  onTimeComplete: (taskName: string, seconds: number) => void
}

export default function TaskTimer({ onTaskChange, onTimeComplete }: TaskTimerProps) {
  const [taskName, setTaskName] = useState("")
  const [duration, setDuration] = useState(25)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  
  const { t } = useTranslation();
  const showAlert = useAlert();
  const elapsedTimeRef = useRef(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3")
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (isActive && !isPaused) {
      const startTime = Date.now() - elapsedTimeRef.current * 1000;
      const targetTime = startTime + duration * 60 * 1000;
  
      intervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const newTimeLeft = Math.max(0, Math.round((targetTime - now) / 1000));

        elapsedTimeRef.current = duration * 60 - newTimeLeft;

        setTimeLeft(newTimeLeft);
        if (newTimeLeft <= 0) {
          clearInterval(intervalRef.current!);
          handleTimerComplete(); 
        }
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, isPaused]);

  const handleTimerComplete = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.error("Error playing sound:", e))
    }

    showAlert(t("alert3", {taskName}));
    setIsActive(false)
    setIsPaused(false)

    if (taskName) {
      setTimeout(() => onTimeComplete(taskName, elapsedTimeRef.current), 0)
    }
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const handleStart = () => {
    if (taskName.trim() === "") {
      showAlert(t("alert4"));
      return
    }

    if (!isActive) {
      setTimeLeft(duration * 60)
      elapsedTimeRef.current = 0
      setIsActive(true)
      setIsPaused(false)
      onTaskChange(taskName)
    } else {
      setIsPaused(false)
    }
  }

  const handlePause = () => {
    setIsPaused(true)
  }

  const handleReset = () => {
    if (isActive && !isPaused && elapsedTimeRef.current > 0) {
      onTimeComplete(taskName, elapsedTimeRef.current)
    }
    setTimeLeft(duration * 60)
    elapsedTimeRef.current = 0
    setIsActive(false)
    setIsPaused(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Manejar cambios en el input 
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value) || 1
    // Asegura que esté entre 1 y 120 minutos
    value = Math.max(1, Math.min(120, value)) 
  
    setDuration(value)
    if (!isActive) setTimeLeft(value * 60)
  }
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder={t("what_work")}
          className="w-full px-4 py-3 bg-[#2a1b3e] text-white placeholder-[#c4b5fd]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c4b5fd]/20 border border-[#c4b5fd]/10"
        />

        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="number"
              min="1"
              max="120"
              value={duration}
              onChange={handleDurationChange}
              onBlur={() => {
                if (duration < 1) {
                  setDuration(1)
                  if (!isActive) setTimeLeft(60)
                }
              }}
              className="w-full px-4 py-3 bg-[#2a1b3e] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c4b5fd]/20 border border-[#c4b5fd]/10"
            />
            <label className="mt-2 block text-sm text-[#c4b5fd]/70">{t("minutes")}</label>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="text-5xl sm:text-7xl font-bold text-white tabular-nums border-4 border-[#c4b5fd]/10 rounded-full w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={isActive && !isPaused ? handlePause : handleStart}
          className={`cursor-pointer px-8 py-3 rounded-lg font-medium transition-colors border ${
            isActive && !isPaused
              ? "bg-[#2a1b3e] text-[#c4b5fd] border-[#c4b5fd]/20"
              : "bg-white text-[#1a0b2e] border-white/5"
          }`}
        >
          {isActive && !isPaused ? t("pause") : t("start")}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="cursor-pointer px-8 py-3 bg-[#2a1b3e] text-[#c4b5fd] rounded-lg font-medium border border-[#c4b5fd]/20"
        >
          {t("reboot")}
        </motion.button>
      </div>
    </motion.div>
  )
}

