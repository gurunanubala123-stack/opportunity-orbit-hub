import type { UIMessage } from "ai";

// Saathi chat threads live in this browser (localStorage). Each thread has its own page URL.
export interface SaathiThread {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
}

const KEY = "adultpass.saathi.threads.v1";
const EMPTY: SaathiThread[] = [];
let cache: SaathiThread[] | null = null;
const listeners = new Set<() => void>();

export function readThreads(): SaathiThread[] {
  if (typeof window === "undefined") return EMPTY;
  if (cache) return cache;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed) ? parsed : [];
  } catch {
    cache = [];
  }
  return cache!;
}

function commit(next: SaathiThread[]) {
  cache = [...next].sort((a, b) => b.updatedAt - a.updatedAt);
  window.localStorage.setItem(KEY, JSON.stringify(cache));
  listeners.forEach((l) => l());
}

export function subscribeThreads(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getThread(id: string) {
  return readThreads().find((t) => t.id === id);
}

export function createThread(): SaathiThread {
  const t: SaathiThread = { id: crypto.randomUUID().slice(0, 8), title: "New chat", updatedAt: Date.now(), messages: [] };
  commit([t, ...readThreads()]);
  return t;
}

/** Idempotent: returns the newest empty thread, or creates one. */
export function getOrCreateLatestThread(): SaathiThread {
  const threads = readThreads();
  return threads.find((t) => t.messages.length === 0) ?? threads[0] ?? createThread();
}

function titleFrom(messages: UIMessage[]): string | undefined {
  const first = messages.find((m) => m.role === "user");
  const text = first?.parts.find((p) => p.type === "text");
  if (!text || text.type !== "text") return undefined;
  return text.text.length > 42 ? `${text.text.slice(0, 42)}…` : text.text;
}

export function saveThreadMessages(id: string, messages: UIMessage[]) {
  const threads = readThreads();
  const existing = threads.find((t) => t.id === id);
  const updated: SaathiThread = {
    id,
    title: titleFrom(messages) ?? existing?.title ?? "New chat",
    updatedAt: messages.length !== existing?.messages.length ? Date.now() : (existing?.updatedAt ?? Date.now()),
    messages,
  };
  commit([updated, ...threads.filter((t) => t.id !== id)]);
}

export function deleteThread(id: string) {
  commit(readThreads().filter((t) => t.id !== id));
}
