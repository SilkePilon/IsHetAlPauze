'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Coffee, Utensils, Sun, Moon } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const breaks = [
  { start: '10:15', end: '10:30', label: 'Morning Break', icon: Coffee },
  { start: '12:00', end: '12:30', label: 'Lunch Break', icon: Utensils },
  { start: '14:30', end: '14:45', label: 'Afternoon Break', icon: Sun },
]

export default function AdvancedCountdown() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeBreak, setActiveBreak] = useState<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      
      const currentBreakIndex = breaks.findIndex((breakTime) => {
        const [startHour, startMinute] = breakTime.start.split(':').map(Number)
        const [endHour, endMinute] = breakTime.end.split(':').map(Number)
        const start = new Date(now).setHours(startHour, startMinute, 0, 0)
        const end = new Date(now).setHours(endHour, endMinute, 0, 0)
        return now >= start && now < end
      })

      if (currentBreakIndex !== -1) {
        setActiveBreak(currentBreakIndex)
      } else {
        const nextBreakIndex = breaks.findIndex((breakTime) => {
          const [startHour, startMinute] = breakTime.start.split(':').map(Number)
          const start = new Date(now).setHours(startHour, startMinute, 0, 0)
          return now < start
        })
        setActiveBreak(nextBreakIndex !== -1 ? nextBreakIndex : null)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getCountdown = () => {
    if (activeBreak === null) {
      return { hours: 0, minutes: 0, seconds: 0, isOngoing: false }
    }

    const breakTime = breaks[activeBreak]
    const [startHour, startMinute] = breakTime.start.split(':').map(Number)
    const [endHour, endMinute] = breakTime.end.split(':').map(Number)
    const start = new Date(currentTime).setHours(startHour, startMinute, 0, 0)
    const end = new Date(currentTime).setHours(endHour, endMinute, 0, 0)

    let diff
    let isOngoing = false

    if (currentTime >= start && currentTime < end) {
      diff = end - currentTime.getTime()
      isOngoing = true
    } else {
      diff = start - currentTime.getTime()
      if (diff < 0) {
        const tomorrow = new Date(currentTime)
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(startHour, startMinute, 0, 0)
        diff = tomorrow.getTime() - currentTime.getTime()
      }
    }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { hours, minutes, seconds, isOngoing }
  }

  const { hours, minutes, seconds, isOngoing } = getCountdown()

  return (
    <div className="text-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      {activeBreak !== null ? (
        <>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            {breaks[activeBreak].icon({ className: "inline-block h-16 w-16 text-blue-500 dark:text-blue-400" })}
            <h2 className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
              {isOngoing ? "Ongoing: " : "Next: "}
              {breaks[activeBreak].label}
            </h2>
          </motion.div>
          <div className="flex justify-center space-x-4">
            {[hours, minutes, seconds].map((value, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="text-6xl font-bold text-gray-800 dark:text-gray-200">
                  {value.toString().padStart(2, '0')}
                </div>
                <div className="text-sm uppercase text-gray-500 dark:text-gray-400">
                  {index === 0 ? 'Hours' : index === 1 ? 'Minutes' : 'Seconds'}
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-sm text-gray-600 dark:text-gray-400"
          >
            {isOngoing ? `Ends at ${breaks[activeBreak].end}` : `Starts at ${breaks[activeBreak].start}`}
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Moon className="h-16 w-16 text-blue-500 dark:text-blue-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            No More Breaks Today
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Time to wrap up and get some rest!
          </p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Next break: {breaks[0].label} at {breaks[0].start} tomorrow
          </p>
        </motion.div>
      )}
    </div>
  )
}

