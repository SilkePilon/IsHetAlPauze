"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Utensils, Sun, Moon, Clock, PartyPopper } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/components/AuthContext";

const breaks = [
  { start: "10:15", end: "10:30", label: "Morning Break", icon: Coffee },
  { start: "12:00", end: "12:30", label: "Lunch Break", icon: Utensils },
  { start: "14:30", end: "14:45", label: "Afternoon Break", icon: Sun },
];

const SCHOOL_START = { hour: 8, minute: 30 };
const END_OF_DAY = { hour: 16, minute: 0 };

export default function AdvancedCountdown() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeBreak, setActiveBreak] = useState<number | null>(null);
  const [quote, setQuote] = useState({ author: "", quote: "" });
  const [showQuote, setShowQuote] = useState(false);
  const [isCounterMounted, setIsCounterMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch(
          "https://programming-quotesapi.vercel.app/api/random"
        );
        const data = await response.json();
        setQuote(data);
      } catch (error) {
        console.error("Error fetching quote:", error);
      }
    };

    fetchQuote();
    setTimeout(() => setIsCounterMounted(true), 500);
    setTimeout(() => setShowQuote(true), 1500);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const currentBreakIndex = breaks.findIndex((breakTime) => {
        const [startHour, startMinute] = breakTime.start.split(":").map(Number);
        const [endHour, endMinute] = breakTime.end.split(":").map(Number);
        const start = new Date(now).setHours(startHour, startMinute, 0, 0);
        const end = new Date(now).setHours(endHour, endMinute, 0, 0);
        return now.getTime() >= start && now.getTime() < end;
      });

      if (currentBreakIndex !== -1) {
        setActiveBreak(currentBreakIndex);
      } else {
        const nextBreakIndex = breaks.findIndex((breakTime) => {
          const [startHour, startMinute] = breakTime.start
            .split(":")
            .map(Number);
          const start = new Date(now).setHours(startHour, startMinute, 0, 0);
          return now.getTime() < start;
        });
        setActiveBreak(nextBreakIndex !== -1 ? nextBreakIndex : null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isSchoolEnded = () => {
    const now = new Date();
    const endTime = new Date(now);
    endTime.setHours(END_OF_DAY.hour, END_OF_DAY.minute, 0, 0);
    return now >= endTime;
  };

  const isBeforeSchool = () => {
    const now = new Date();
    const startTime = new Date(now);
    startTime.setHours(SCHOOL_START.hour, SCHOOL_START.minute, 0, 0);
    return now < startTime;
  };

  const getCountdown = (targetHour: number, targetMinute: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setHours(targetHour, targetMinute, 0, 0);

    if (now >= target) {
      target.setDate(target.getDate() + 1);
    }

    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  const getBreakCountdown = () => {
    if (activeBreak === null) {
      return { hours: 0, minutes: 0, seconds: 0, isOngoing: false };
    }

    const breakTime = breaks[activeBreak];
    const [startHour, startMinute] = breakTime.start.split(":").map(Number);
    const [endHour, endMinute] = breakTime.end.split(":").map(Number);
    const start = new Date(currentTime).setHours(startHour, startMinute, 0, 0);
    const end = new Date(currentTime).setHours(endHour, endMinute, 0, 0);

    let diff;
    let isOngoing = false;

    if (currentTime.getTime() >= start && currentTime.getTime() < end) {
      diff = end - currentTime.getTime();
      isOngoing = true;
    } else {
      diff = start - currentTime.getTime();
      if (diff < 0) {
        const tomorrow = new Date(currentTime);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(startHour, startMinute, 0, 0);
        diff = tomorrow.getTime() - currentTime.getTime();
      }
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, isOngoing };
  };

  const CountdownDisplay = ({
    hours,
    minutes,
    seconds,
    previousValues = { hours: 0, minutes: 0, seconds: 0 },
  }: {
    hours: number;
    minutes: number;
    seconds: number;
    previousValues?: { hours: number; minutes: number; seconds: number };
  }) => (
    <div className="flex justify-center space-x-4">
      {[
        { value: hours, prevValue: previousValues.hours, label: "Hours" },
        { value: minutes, prevValue: previousValues.minutes, label: "Minutes" },
        { value: seconds, prevValue: previousValues.seconds, label: "Seconds" },
      ].map(({ value, prevValue, label }, index) => (
        <motion.div
          key={index}
          initial={false}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <AnimatePresence mode="wait">
              {value !== prevValue && (
                <motion.div
                  key={value}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-6xl font-bold text-gray-800 dark:text-gray-200"
                >
                  {value.toString().padStart(2, "0")}
                </motion.div>
              )}
              {value === prevValue && (
                <div className="text-6xl font-bold text-gray-800 dark:text-gray-200">
                  {value.toString().padStart(2, "0")}
                </div>
              )}
            </AnimatePresence>
          </div>
          <div className="text-sm uppercase text-gray-500 dark:text-gray-400">
            {label}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const { hours, minutes, seconds, isOngoing } = getBreakCountdown();
  const endOfDayCountdown = getCountdown(END_OF_DAY.hour, END_OF_DAY.minute);
  const startOfDayCountdown = getCountdown(
    SCHOOL_START.hour,
    SCHOOL_START.minute
  );

  const schoolEndedContent = (
    <motion.div
      layout
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <PartyPopper className="h-16 w-16 text-yellow-500 dark:text-yellow-400 mb-4" />
      {user && user.role === "teacher" ? (
        <p className=" font-bold text-gray-800 dark:text-gray-200 mb-2">
          Hey {user.name} 🎉
        </p>
      ) : null}
      {user && user.role === "student" ? (
        <p className=" font-bold text-gray-800 dark:text-gray-200 mb-2">
          Hey {user.name}, lets go home 🎉
        </p>
      ) : null}

      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        School Day Has Ended!
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        See you tomorrow at {SCHOOL_START.hour}:
        {SCHOOL_START.minute.toString().padStart(2, "0")}!
      </p>
    </motion.div>
  );

  const beforeSchoolContent = (
    <motion.div
      layout
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <Sun className="h-16 w-16 text-yellow-500 dark:text-yellow-400 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        School Hasn&apos;t Started Yet
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Time until school starts:
      </p>
      <CountdownDisplay
        hours={startOfDayCountdown.hours}
        minutes={startOfDayCountdown.minutes}
        seconds={startOfDayCountdown.seconds}
      />
    </motion.div>
  );

  const regularContent =
    activeBreak !== null ? (
      <motion.div
        layout
        transition={{ duration: 0.5 }}
        className={`flex flex-col items-center ${
          isCounterMounted ? "-mt-20" : "mt-0"
        }`}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {breaks[activeBreak].icon({
            className:
              "inline-block h-16 w-16 text-blue-500 dark:text-blue-400",
          })}
          <h2 className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
            {isOngoing ? "Ongoing: " : "Next: "}
            {breaks[activeBreak].label}
          </h2>
        </motion.div>

        <CountdownDisplay hours={hours} minutes={minutes} seconds={seconds} />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-sm text-gray-600 dark:text-gray-400"
        >
          {isOngoing
            ? `Ends at ${breaks[activeBreak].end}`
            : `Starts at ${breaks[activeBreak].start}`}
        </motion.div>
      </motion.div>
    ) : (
      <motion.div
        layout
        transition={{ duration: 0.5 }}
        className={`flex flex-col items-center ${
          isCounterMounted ? "-mt-20" : "mt-0"
        }`}
      >
        <Moon className="h-16 w-16 text-blue-500 dark:text-blue-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          No More Breaks Today
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Almost there! Time until the end of the school day:
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <CountdownDisplay
            hours={endOfDayCountdown.hours}
            minutes={endOfDayCountdown.minutes}
            seconds={endOfDayCountdown.seconds}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-sm text-gray-500 dark:text-gray-400"
        >
          <Clock className="inline-block h-4 w-4 mr-2 mb-1" />
          School starts at {SCHOOL_START.hour}:
          {SCHOOL_START.minute.toString().padStart(2, "0")}
        </motion.div>
      </motion.div>
    );

  let mainContent;
  if (isSchoolEnded()) {
    mainContent = schoolEndedContent;
  } else if (isBeforeSchool()) {
    mainContent = beforeSchoolContent;
  } else {
    mainContent = regularContent;
  }

  return (
    <div className="text-center min-h-screen flex flex-col justify-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {mainContent}

      <AnimatePresence>
        {showQuote && quote.quote && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{
              duration: 0.6,
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            className="mt-16 max-w-md mx-auto"
          >
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg italic text-gray-700 dark:text-gray-300"
            >
              &quot;{quote.quote}&quot;
            </motion.p>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2 text-sm text-gray-500 dark:text-gray-400"
            >
              — {quote.author}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
