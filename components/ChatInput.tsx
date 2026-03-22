"use client";

import { useState, useRef, KeyboardEvent } from "react";

interface Props {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: Props) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  return (
    <div className="px-4 py-3 bg-white border-t border-stone-200">
      <div className="flex items-end gap-2 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask me anything about Falcon Inn..."
          rows={1}
          className="flex-1 bg-transparent text-stone-800 placeholder-stone-400 text-sm resize-none outline-none leading-relaxed py-1"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="w-8 h-8 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-200 disabled:cursor-not-allowed text-white disabled:text-stone-400 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 mb-0.5"
          aria-label="Send message"
        >
          {isLoading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>
      <p className="text-center text-xs text-stone-400 mt-2">
        Press Enter to send · Shift+Enter for new line ·{" "}
        <a
          href="https://lundyslane.com/accommodation/falcon-inn/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-600 hover:text-amber-500 font-medium"
        >
          Book directly for best rates
        </a>
      </p>
    </div>
  );
}
