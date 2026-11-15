// Browser voice helpers: Saathi speaks answers aloud (speechSynthesis) and listens (SpeechRecognition).
// Call only from effects or event handlers.

export type VoiceLang = "en-IN" | "hi-IN";

export function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "the official link")
    .replace(/[#>*_~|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(lang: VoiceLang) {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === lang) ??
    voices.find((v) => v.lang.startsWith(lang.slice(0, 2))) ??
    voices.find((v) => v.lang.startsWith("en"))
  );
}

export function speak(text: string, lang: VoiceLang, onEnd?: () => void) {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
  const clean = stripMarkdown(text);
  // Detect Devanagari so Hindi answers use a Hindi voice automatically
  const useLang: VoiceLang = /[\u0900-\u097F]/.test(clean) ? "hi-IN" : lang;
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = useLang;
  const v = pickVoice(useLang);
  if (v) u.voice = v;
  u.rate = 1;
  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.();
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}

type RecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start: () => void;
  stop: () => void;
};

export function getRecognition(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}
