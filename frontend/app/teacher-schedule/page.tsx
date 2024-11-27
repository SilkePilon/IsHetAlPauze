"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthContext";

type Schedule = {
  [key: string]: boolean;
};

export default function TeacherSchedule() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<Schedule>({});

  useEffect(() => {
    // Mock API call to get teacher's schedule
    const fetchSchedule = async () => {
      if (user && user.role === "teacher") {
        // In a real app, you'd fetch this from your backend
        const mockSchedule = {
          Monday: true,
          Tuesday: true,
          Wednesday: false,
          Thursday: true,
          Friday: true,
        };
        setSchedule(mockSchedule);
      }
    };
    fetchSchedule();
  }, [user]);

  if (!user || user.role !== "teacher") {
    return <div>You must be logged in as a teacher to view this page.</div>;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Teacher Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {Object.entries(schedule).map(([day, isPresent]) => (
            <li key={day} className="flex justify-between items-center py-2">
              <span>{day}</span>
              <span>{isPresent ? "Present" : "Absent"}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
