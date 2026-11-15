import { createFileRoute, redirect } from "@tanstack/react-router";
import { getOrCreateLatestThread } from "@/lib/saathi-threads";

// Chats are saved in the browser, so pick/create the thread on the client and go to its page.
export const Route = createFileRoute("/assistant/")({
  ssr: false,
  beforeLoad: () => {
    const thread = getOrCreateLatestThread();
    throw redirect({ to: "/assistant/$threadId", params: { threadId: thread.id }, replace: true });
  },
  head: () => ({
    meta: [
      { title: "Saathi AI — talking helper for 18+ documents | AdultPass" },
      { name: "description", content: "Ask Saathi, the AI helper, anything about Aadhaar, PAN, Voter ID, licence and passport — by voice or text." },
      { property: "og:title", content: "Saathi AI — talking helper for 18+ documents" },
      { property: "og:description", content: "Voice and chat answers in Hindi or English about every adult document in India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
