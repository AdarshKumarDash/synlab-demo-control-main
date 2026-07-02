import { useEffect, useState, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Bot, AlertTriangle } from "lucide-react";
import { askCognix } from "@/ai/cognix";
import { loadChat, saveChat } from "@/lib/chatStorage";
import type { ChatMessage } from "@/types/chat";
import ReactMarkdown from "react-markdown";
import { useSensors } from "@/hooks/useSensors";
import { buildSensorContext } from "@/ai/sensorContext";

interface SynBotAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SynBotAssistant = ({ open, onOpenChange }: SynBotAssistantProps) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data } = useSensors();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const saved = loadChat();

    if (saved.length > 0) {
      setMessages(saved);
      return;
    }

    const welcomeMessage: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      role: "assistant",
      content:
        "Hello! 👋 I'm Cognix, your AI lab assistant. I can help explain experiments, interpret sensor readings, and guide you through safe scientific exploration.",
      timestamp: Date.now(),
    };

    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      saveChat(messages);
    }
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const userText = (text ?? message).trim();
    console.log("SEND CLICKED:", userText);

    if (!userText || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      role: "user",
      content: userText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setMessage("");
    setLoading(true);

    try {
      const sensorContext = buildSensorContext(data);

      const response = await askCognix(userText, messages, sensorContext);

      const aiMessage: ChatMessage = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        role: "assistant",
        content:
          "Sorry, I couldn't reach the AI service right now. Please try again.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMessage]);

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const suggestedPrompts = [
    "Explain this experiment",
    "Is this safe?",
    "What should I observe?",
    "How do sensors work?",
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl rounded-l-3xl border-l-border/50 p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-synbot flex items-center justify-center shadow-glow animate-glow-pulse">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>

              <div>
                <SheetTitle className="text-xl font-display">Cognix</SheetTitle>
                <p className="text-sm text-muted-foreground">
                  Our AI Assistant
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                localStorage.removeItem("cognix-chat-history");
                setMessages([]);
              }}
            >
              Clear
            </Button>
          </div>
        </SheetHeader>

        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Messages */}
          <div className="space-y-4 mb-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-synbot flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] px-5 py-4 rounded-3xl shadow-md whitespace-pre-wrap leading-relaxed text-[15px] ${
                    msg.role === "user"
                      ? "bg-gradient-primary text-primary-foreground"
                      : "bg-card border border-border/50 text-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-3 rounded-2xl">
                  <div className="animate-pulse">Cognix is thinking...</div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3">
              Suggested Questions
            </p>

            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(prompt)}
                  className="px-4 py-2 rounded-full bg-primary-soft border border-primary/20 text-sm text-foreground hover:bg-primary/10 hover:border-primary/30 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Disclaimer */}
        <div className="px-6 py-3 bg-status-idle/10 border-t border-status-idle/20">
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-status-idle" />
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">Demo Mode</span> –
              AI Assistant is in Pilot Version
            </span>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border/50">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask SynBot anything..."
              className="flex-1 rounded-xl border-border/50 focus:border-primary/50"
            />
            <Button
              size="icon"
              onClick={() => sendMessage()}
              className="w-11 h-11 rounded-xl bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={!message.trim() || loading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SynBotAssistant;
