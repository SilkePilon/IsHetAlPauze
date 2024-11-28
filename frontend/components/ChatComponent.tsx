"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClientSupabaseClient } from "@/utils/supabase/client";
import { Send, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { Message } from "@/types/supabase";

const ChatApp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const supabase = createClientSupabaseClient();

  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        id,
        content,
        user_id,
        created_at,
        user:users(name)
      `
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data as Message[]);
    }
  }, [supabase]);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchMessages]);

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !user) return;

    setIsLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .insert({
        content: newMessage,
        user_id: user.id,
      })
      .select(
        `
      id,
      content,
      user_id,
      created_at,
      user:users(name)
    `
      )
      .single();

    setIsLoading(false);

    if (error) {
      console.error("Error sending message:", error);
      return;
    }

    if (data) {
      setMessages((prevMessages) => [...prevMessages, data as Message]);
    }

    setNewMessage("");
  }, [newMessage, supabase, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Chat Room
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-100/50 dark:bg-gray-700/50 rounded-md">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`mb-2 p-2 rounded-lg ${
                  message.user_id === user?.id
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : "bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 self-start mr-auto"
                } max-w-[70%]`}
              >
                <p className="text-sm font-semibold">{message.user?.name}</p>
                <p>{message.content}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center">
          <Input
            ref={inputRef}
            className="flex-grow mr-2 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatApp;
