import { ChatMessage } from "@/types/chat";

const STORAGE_KEY = "cognix-chat-history";

export function loadChat(): ChatMessage[] {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function saveChat(messages: ChatMessage[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(messages)
  );
}

export function clearChat() {
  localStorage.removeItem(STORAGE_KEY);
}