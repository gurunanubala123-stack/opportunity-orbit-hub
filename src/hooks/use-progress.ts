import { useSyncExternalStore } from "react";

// Tracker state lives in this browser only (localStorage), shared across tabs/components.
const KEY = "adultpass.progress.v1";
const EVENT = "adultpass-progress";
const EMPTY: string[] = [];
let cache: string[] | null = null;

function read(): string[] {
  if (typeof window === "undefined") return EMPTY;
  if (cache) return cache;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: string[]) {
  cache = next;
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress() {
  const done = useSyncExternalStore(subscribe, read, () => EMPTY);
  const isDone = (slug: string) => done.includes(slug);
  const toggle = (slug: string) => {
    const cur = read();
    write(cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]);
  };
  const reset = () => write([]);
  return { done, isDone, toggle, reset };
}
