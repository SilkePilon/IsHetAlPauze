import ChatApp from "@/components/ChatComponent";

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Chat Room
        </h1>
        <ChatApp />
      </div>
    </main>
  );
}
