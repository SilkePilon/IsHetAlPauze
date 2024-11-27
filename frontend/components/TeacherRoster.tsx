'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users } from 'lucide-react'

interface Teacher {
  id: string
  name: string
  avatar: string
}

export default function TeacherRoster() {
  const [teachers, setTeachers] = useState<Teacher[]>([])

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    setTeachers([
      { id: '1', name: 'John Doe', avatar: '/avatars/john-doe.jpg' },
      { id: '2', name: 'Jane Smith', avatar: '/avatars/jane-smith.jpg' },
      { id: '3', name: 'Bob Johnson', avatar: '/avatars/bob-johnson.jpg' },
    ])
  }, [])

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-6 w-6" />
          Teachers Present Today
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={teacher.avatar} alt={teacher.name} />
                <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{teacher.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

