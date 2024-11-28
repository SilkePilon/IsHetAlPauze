"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, LogIn, UserPlus, Calendar, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from "@/components/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";

export default function NavigationButtons() {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  return (
    <div className="fixed top-4 right-4 flex items-center space-x-2 z-50">
      <Link href="/">
        <Button variant="outline" size="icon">
          <Home className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Home</span>
        </Button>
      </Link>

      {!user ? (
        <>
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
        </>
      ) : (
        <>
          <Link href="/chat">
            <Button variant="outline" size="icon">
              <MessageSquare className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Chat</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              toast({
                title: "Successfully logged out!",
                description: "We are sorry to see you go.",
                variant: "default",
              });
              logout();
            }}
          >
            <LogOut className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Logout</span>
          </Button>
        </>
      )}

      {user && user.role === "teacher" && (
        <Link href="/teacher-schedule">
          <Button variant="outline" size="icon">
            <Calendar className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Teacher Schedule</span>
          </Button>
        </Link>
      )}

      <ThemeToggle />
    </div>
  );
}

