"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import HotelHeader from "@/components/HotelHeader";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Welcome to Falcon Inn! 🦅 I'm your personal concierge, here to help make your Niagara Falls getaway unforgettable.\n\nWhether you have questions about our rooms, amenities, check-in times, or the amazing attractions nearby — I'm here for you! And if you're ready to book, I can point you to our best rates.\n\nHow can I help you today?",
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: userText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    const assistantMessage: Message = { role: "assistant", content: "" };
    setMessages([...updatedMessages, assistantMessage]);

    try {
      // Build conversation history for the API (skip local welcome message)
      const apiMessages = updatedMessages
        .filter((_, i) => i > 0)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) throw new Error("API request failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No response body");

      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                accumulated += parsed.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: accumulated,
                  };
                  return updated;
                });
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content:
            "I'm sorry, I'm having trouble connecting right now. Please call us directly at +1 905-354-2279 and our front desk team will be happy to help!",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "What time is check-in?",
    "Do you have a pool?",
    "How far are you from Niagara Falls?",
    "What's your cancellation policy?",
  ];

  return (
    <div className="flex flex-col h-screen bg-stone-50">
      <HotelHeader />

      <main className="flex-1 overflow-hidden flex flex-col max-w-3xl mx-auto w-full">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}

          {isLoading && messages[messages.length - 1]?.content === "" && (
            <div className="flex items-center gap-2 text-stone-400 pl-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
              <span className="text-sm">Concierge is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions — only show initially */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-stone-400 mb-2 font-medium uppercase tracking-wide">
              Quick questions
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-sm px-3 py-1.5 bg-white border border-amber-200 text-amber-700 rounded-full hover:bg-amber-50 hover:border-amber-400 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
}
