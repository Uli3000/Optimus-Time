import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useAlert } from "./AlertDialog"

interface BreakTimerProps {
  taskName: string
  onTimeComplete: (taskName: string, seconds: number) => void
}

export default function BreakTimer({ taskName, onTimeComplete }: BreakTimerProps) {
  const [duration, setDuration] = useState(5)
  const [timeLeft, setTimeLeft] = useState(5 * 60)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const showAlert = useAlert();
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<number | null>(null)
  const elapsedTimeRef = useRef(0)

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3")
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
        elapsedTimeRef.current += 1
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isActive, isPaused])

  const handleTimerComplete = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.error("Error playing sound:", e))
    }
  
    showAlert(`Tiempo de descanso de la tarea ${taskName} terminado`);
    setIsActive(false)
    setIsPaused(false)
  
    if (intervalRef.current) clearInterval(intervalRef.current)
  
    setTimeout(() => {
      if (taskName) onTimeComplete(taskName, elapsedTimeRef.current)
    }, 0)
  }
  

  const handleStart = () => {
    if (taskName.trim() === "") {
      showAlert("Primero debes iniciar una tarea");
      return;
    }

    if (!isActive) {
      setTimeLeft(duration * 60)
      elapsedTimeRef.current = 0
      setIsActive(true)
      setIsPaused(false)
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

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number.parseInt(e.target.value) || 1
  
    value = Math.max(1, Math.min(value, 60))
  
    setDuration(value)
    if (!isActive) setTimeLeft(value * 60)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      <h2 className="text-lg font-medium text-[#c4b5fd]">{taskName ? `Descanso de: ${taskName}` : "Descanso"}</h2>

      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="number"
            min="1"
            max="60"
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
          <label className="mt-2 block text-sm text-[#c4b5fd]/70">Minutos de Descanso</label>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="text-4xl sm:text-6xl font-bold text-white tabular-nums border-4 border-[#c4b5fd]/10 rounded-full w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
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
          disabled={!taskName}
        >
          {isActive && !isPaused ? "Pausar" : "Iniciar"}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="cursor-pointer px-8 py-3 bg-[#2a1b3e] text-[#c4b5fd] rounded-lg font-medium border border-[#c4b5fd]/20"
          disabled={!taskName}
        >
          Reiniciar
        </motion.button>
      </div>
    </motion.div>
  )
}
