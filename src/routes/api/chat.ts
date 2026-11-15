import { createFileRoute } from "@tanstack/react-router";
import { handleSaathiChat } from "@/lib/ai/saathi.server";

export const Route = createFileRoute("/api/chat")({
  server: { handlers: { POST: ({ request }) => handleSaathiChat(request) } },
});
