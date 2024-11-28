import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await getServerSession()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const stream = new ReadableStream({
    async start(controller) {
      const sendMessage = (message: any) => {
        controller.enqueue(`data: ${JSON.stringify(message)}\n\n`)
      }

      const interval = setInterval(async () => {
        const newMessages = await prisma.message.findMany({
          where: {
            groupType: user.role,
            createdAt: { gt: new Date(Date.now() - 5000) }, // Last 5 seconds
          },
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { name: true } } },
        })

        newMessages.forEach(sendMessage)
      }, 5000)

      // Clean up on close
      req.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

