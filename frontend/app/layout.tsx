import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import ThemeToggle from '../components/ThemeToggle'
import { Button } from "@/components/ui/button"
import { Home, LogIn, UserPlus } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'School Break Timer',
  description: 'A countdown timer for school breaks with teacher roster',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="fixed top-4 right-4 flex items-center space-x-2 z-50">
          <Link href="/">
            <Button variant="outline" size="icon">
              <Home className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Home</span>
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="icon">
              <LogIn className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Login</span>
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" size="icon">
              <UserPlus className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Sign Up</span>
            </Button>
          </Link>
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  )
}

