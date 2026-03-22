import { Message } from "@/app/page";

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isAssistant = message.role === "assistant";

  // Simple markdown-like rendering: bold, line breaks
  const renderContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      // Bold text: **text**
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={i}>
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  if (isAssistant) {
    return (
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-stone-900 font-bold text-sm flex-shrink-0 mt-0.5 shadow-sm">
          🦅
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-stone-400 mb-1 font-medium">
            Falcon Inn Concierge
          </p>
          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-stone-100 text-stone-800 text-sm leading-relaxed">
            {message.content ? (
              renderContent(message.content)
            ) : (
              <span className="text-stone-300 italic">typing...</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="flex-1 min-w-0 flex flex-col items-end">
        <p className="text-xs text-stone-400 mb-1 font-medium">You</p>
        <div className="bg-amber-500 rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm text-stone-900 text-sm leading-relaxed max-w-[80%]">
          {message.content}
        </div>
      </div>

      {/* User avatar */}
      <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center text-stone-500 flex-shrink-0 mt-0.5 shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      </div>
    </div>
  );
}
