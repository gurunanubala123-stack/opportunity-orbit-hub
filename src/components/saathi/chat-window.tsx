import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Copy, Mic, MicOff, Square, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageAction, MessageActions, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput, PromptInputButton, PromptInputFooter, PromptInputProvider, PromptInputSubmit,
  PromptInputTextarea, PromptInputTools, usePromptInputController, type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { saveThreadMessages } from "@/lib/saathi-threads";
import { canSpeak, getRecognition, speak, stopSpeaking, type VoiceLang } from "@/lib/speech";
import { cn } from "@/lib/utils";
import { SaathiMark } from "./saathi-mark";

const SUGGESTIONS = [
  "I just turned 18. Which documents should I get first?",
  "पासपोर्ट के लिए कौन से दस्तावेज़ चाहिए?",
  "How do I register as a new voter?",
  "What is the fee for a learner's licence?",
  "How can I get an instant e-PAN for free?",
];

const AUTO_SPEAK_KEY = "adultpass.saathi.autospeak";

function textOf(m: UIMessage) {
  return m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

export function ChatWindow(props: { threadId: string; initialMessages: UIMessage[] }) {
  return (
    <TooltipProvider delayDuration={200}>
      <PromptInputProvider>
        <ChatWindowInner {...props} />
      </PromptInputProvider>
    </TooltipProvider>
  );
}

function ChatWindowInner({ threadId, initialMessages }: { threadId: string; initialMessages: UIMessage[] }) {
  const controller = usePromptInputController();
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [lang, setLang] = useState<VoiceLang>("en-IN");
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const recRef = useRef<{ stop: () => void } | null>(null);
  const autoSpeakRef = useRef(autoSpeak);
  autoSpeakRef.current = autoSpeak;
  const langRef = useRef(lang);
  langRef.current = lang;

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat", body: { threadId } }), [threadId]);

  const { messages, sendMessage, status, stop, error } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (e) => {
      const msg = e.message || "Something went wrong.";
      if (/429|rate/i.test(msg)) toast.error("Saathi is busy right now. Please try again in a moment.");
      else if (/402|credit/i.test(msg)) toast.error("AI credits have run out for this app.");
      else toast.error(msg.length > 160 ? "Saathi couldn't answer. Check your connection and try again." : msg);
    },
    onFinish: ({ message }) => {
      if (autoSpeakRef.current && canSpeak()) {
        const t = textOf(message);
        if (t) {
          setSpeakingId(message.id);
          speak(t, langRef.current, () => setSpeakingId(null));
        }
      }
    },
  });

  const busy = status === "submitted" || status === "streaming";

  // Persist this thread's messages to the browser once each turn settles
  useEffect(() => {
    if (status === "streaming" || messages.length === 0) return;
    saveThreadMessages(threadId, messages);
  }, [messages, status, threadId]);

  useEffect(() => {
    const saved = window.localStorage.getItem(AUTO_SPEAK_KEY);
    if (saved !== null) setAutoSpeak(saved === "1");
    return () => {
      stopSpeaking();
      recRef.current?.stop();
    };
  }, []);

  const focusBox = useCallback(() => {
    document.querySelector<HTMLTextAreaElement>("#saathi-input")?.focus();
  }, []);
  useEffect(() => {
    if (!busy) focusBox();
  }, [busy, focusBox, threadId]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    stopSpeaking();
    setSpeakingId(null);
    sendMessage({ text: t });
  };

  const onSubmit = (m: PromptInputMessage) => send(m.text);

  const toggleMic = () => {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const Rec = getRecognition();
    if (!Rec) {
      toast.error("Voice input works in Chrome or Edge. You can still type your question.");
      return;
    }
    stopSpeaking();
    const rec = new Rec();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = "";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        const t = r?.[0]?.transcript ?? "";
        if (r?.isFinal) finalText += t;
        else interim += t;
      }
      controller.textInput.setInput(finalText + interim);
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed") toast.error("Microphone permission was blocked.");
    };
    rec.onend = () => {
      setListening(false);
      recRef.current = null;
      if (finalText.trim()) {
        controller.textInput.clear();
        send(finalText);
      }
    };
    recRef.current = rec;
    setListening(true);
    rec.start();
  };

  const toggleSpeak = (m: UIMessage) => {
    if (speakingId === m.id) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(m.id);
    speak(textOf(m), lang, () => setSpeakingId(null));
  };

  const last = messages.at(-1);
  const waiting = status === "submitted" || (status === "streaming" && last?.role === "assistant" && !textOf(last));

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl gap-8 px-4 py-8">
          {messages.length === 0 && (
            <div className="flex flex-col items-center py-10 text-center animate-rise">
              <SaathiMark className="size-20 text-4xl" />
              <h2 className="mt-6 font-display text-4xl">Namaste! I'm Saathi.</h2>
              <p className="mt-2 max-w-md text-muted-foreground">
                Ask me anything about Aadhaar, PAN, Voter ID, licence, passport and more. Tap the mic to talk — I'll answer out loud.
              </p>
              <div className="mt-8 flex max-w-2xl flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border bg-card/60 px-4 py-2 text-sm text-muted-foreground transition hover:border-primary hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <Message key={m.id} from={m.role}>
              {m.role === "assistant" ? (
                <div className="flex gap-3">
                  <SaathiMark className="mt-0.5 size-8 text-base" speaking={speakingId === m.id} />
                  <div className="min-w-0 flex-1">
                    <MessageContent className="text-[15px] leading-relaxed">
                      {m.parts.map((p, i) =>
                        p.type === "text" ? (
                          <MessageResponse key={i} className="[&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1">{p.text}</MessageResponse>
                        ) : null,
                      )}
                    </MessageContent>
                    {textOf(m) && !(busy && m.id === last?.id) && (
                      <MessageActions className="mt-2">
                        {canSpeak() && (
                          <MessageAction tooltip={speakingId === m.id ? "Stop" : "Listen"} onClick={() => toggleSpeak(m)}>
                            {speakingId === m.id ? <Square /> : <Volume2 />}
                          </MessageAction>
                        )}
                        <MessageAction
                          tooltip="Copy"
                          onClick={() => {
                            navigator.clipboard.writeText(textOf(m));
                            toast.success("Copied");
                          }}
                        >
                          <Copy />
                        </MessageAction>
                      </MessageActions>
                    )}
                  </div>
                </div>
              ) : (
                <MessageContent className="group-[.is-user]:rounded-2xl group-[.is-user]:rounded-br-sm group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground">
                  {textOf(m)}
                </MessageContent>
              )}
            </Message>
          ))}

          {waiting && (
            <div className="flex items-center gap-3">
              <SaathiMark className="size-8 text-base" />
              <Shimmer>Saathi is thinking…</Shimmer>
            </div>
          )}
          {error && status === "error" && (
            <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
              Saathi couldn't answer that. Please try sending your question again.
            </p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border bg-background/80 px-4 pb-5 pt-4 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl">
          {listening && (
            <p className="mb-2 flex items-center gap-2 text-sm text-primary">
              <span className="size-2 animate-pulse rounded-full bg-destructive" /> Listening… speak now
            </p>
          )}
          <PromptInput onSubmit={onSubmit} className="rounded-2xl border-gold-line bg-card shadow-glow">
            <PromptInputTextarea id="saathi-input" placeholder="Ask about any document… (Hindi or English)" />
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputButton
                  onClick={toggleMic}
                  tooltip={listening ? "Stop listening" : "Speak your question"}
                  className={cn(listening && "bg-destructive/20 text-destructive")}
                  aria-label={listening ? "Stop listening" : "Speak your question"}
                >
                  {listening ? <MicOff /> : <Mic />}
                </PromptInputButton>
                <PromptInputButton
                  onClick={() => {
                    const next = !autoSpeak;
                    setAutoSpeak(next);
                    window.localStorage.setItem(AUTO_SPEAK_KEY, next ? "1" : "0");
                    if (!next) {
                      stopSpeaking();
                      setSpeakingId(null);
                    }
                  }}
                  tooltip={autoSpeak ? "Voice replies on" : "Voice replies off"}
                  aria-label="Toggle voice replies"
                  className={cn(autoSpeak && "text-primary")}
                >
                  {autoSpeak ? <Volume2 /> : <VolumeX />}
                  <span className="text-xs">{autoSpeak ? "Voice on" : "Voice off"}</span>
                </PromptInputButton>
                <PromptInputButton
                  onClick={() => setLang((l) => (l === "en-IN" ? "hi-IN" : "en-IN"))}
                  tooltip="Voice language"
                  aria-label="Switch voice language"
                >
                  <span className="text-xs font-semibold">{lang === "en-IN" ? "EN" : "हिं"}</span>
                </PromptInputButton>
              </PromptInputTools>
              <PromptInputSubmit status={status} onStop={stop} disabled={!busy && !controller.textInput.value.trim()} />
            </PromptInputFooter>
          </PromptInput>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Saathi can make mistakes. Never share OTPs or passwords. Confirm fees on official sites.
          </p>
        </div>
      </div>
    </div>
  );
}
