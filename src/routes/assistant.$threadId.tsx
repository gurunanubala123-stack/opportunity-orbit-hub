import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MessageSquarePlus, PanelLeft, Trash2 } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { ChatWindow } from "@/components/saathi/chat-window";
import { SaathiMark } from "@/components/saathi/saathi-mark";
import { createThread, deleteThread, getThread, readThreads, subscribeThreads } from "@/lib/saathi-threads";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistant/$threadId")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Chat with Saathi AI | AdultPass" },
      { name: "description", content: "Your conversation with Saathi, the talking AI helper for adult documents in India." },
      { property: "og:title", content: "Chat with Saathi AI | AdultPass" },
      { property: "og:description", content: "Ask about Aadhaar, PAN, Voter ID, licence and passport by voice or text." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AssistantPage,
});

const EMPTY: ReturnType<typeof readThreads> = [];

function AssistantPage() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();
  const threads = useSyncExternalStore(subscribeThreads, readThreads, () => EMPTY);
  const [sideOpen, setSideOpen] = useState(false);
  const thread = threads.find((t) => t.id === threadId);

  const newChat = () => {
    const t = createThread();
    setSideOpen(false);
    navigate({ to: "/assistant/$threadId", params: { threadId: t.id } });
  };

  const remove = (id: string) => {
    deleteThread(id);
    if (id === threadId) {
      const rest = readThreads();
      const next = rest[0] ?? createThread();
      navigate({ to: "/assistant/$threadId", params: { threadId: next.id }, replace: true });
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] max-w-7xl">
      <aside
        className={cn(
          "absolute inset-y-16 left-0 z-30 w-72 shrink-0 flex-col border-r border-border bg-sidebar p-4 md:static md:flex",
          sideOpen ? "flex" : "hidden",
        )}
      >
        <Button variant="gold" className="w-full rounded-full" onClick={newChat}>
          <MessageSquarePlus /> New chat
        </Button>
        <p className="mt-6 px-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Your chats</p>
        <ul className="mt-2 flex-1 space-y-1 overflow-y-auto">
          {threads.map((t) => (
            <li key={t.id} className={cn("group flex items-center gap-1 rounded-xl transition", t.id === threadId ? "bg-primary/10" : "hover:bg-muted")}>
              <Link
                to="/assistant/$threadId"
                params={{ threadId: t.id }}
                onClick={() => setSideOpen(false)}
                className={cn("min-w-0 flex-1 truncate px-3 py-2.5 text-sm", t.id === threadId ? "text-primary" : "text-muted-foreground")}
              >
                {t.title}
              </Link>
              <button
                onClick={() => remove(t.id)}
                aria-label={`Delete chat ${t.title}`}
                className="mr-1 rounded-lg p-1.5 text-muted-foreground opacity-0 transition hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4 px-2 text-[11px] text-muted-foreground">Chats are saved only in this browser.</p>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSideOpen((o) => !o)} aria-label="Show chats">
            <PanelLeft />
          </Button>
          <SaathiMark className="size-9 text-lg" />
          <div className="leading-tight">
            <p className="font-display text-xl">Saathi</p>
            <p className="text-xs text-muted-foreground">AI helper · speaks Hindi & English</p>
          </div>
        </div>
        {thread ? (
          <ChatWindow key={threadId} threadId={threadId} initialMessages={getThread(threadId)?.messages ?? []} />
        ) : (
          <div className="grid flex-1 place-items-center p-8 text-center">
            <div>
              <p className="font-display text-3xl">This chat isn't on this device</p>
              <p className="mt-2 text-muted-foreground">Chats are saved only in the browser where they were created.</p>
              <Button variant="gold" className="mt-6 rounded-full" onClick={newChat}>Start a new chat</Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
