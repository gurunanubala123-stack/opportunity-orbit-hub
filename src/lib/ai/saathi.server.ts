import { convertToModelMessages, type UIMessage } from "ai";
import { documentsAsKnowledge } from "@/data/documents";
import { createResponsesCall } from "./responses.server";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

function instructions() {
  return `You are "Saathi", the friendly AI helper of AdultPass — a website that helps young people in India who are turning 18 apply for their adult documents from one page.

Rules:
- Answer ONLY using the document knowledge below plus general, well-known facts about these Indian government processes. If you are unsure, say so and point to the official link.
- Reply in the same language the user writes in (English, Hindi or Hinglish).
- Keep answers short, warm and practical: 2–6 sentences or a short numbered list. Your replies are often read aloud, so avoid tables and long link lists.
- When relevant, mention the official link and the guide page on this site (e.g. /documents/passport).
- Always remind users that fees and timelines can change and to confirm on the official website when you give numbers.
- Never ask for or store Aadhaar numbers, OTPs or passwords. Warn users never to share OTPs.

DOCUMENT KNOWLEDGE:
${documentsAsKnowledge()}`;
}

export async function handleSaathiChat(request: Request): Promise<Response> {
  const apiKey = process.env['LOVABLE_API_KEY'];
  if (!apiKey) return Response.json({ error: "AI is not configured." }, { status: 500 });

  let body: { messages?: unknown; threadId?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0 || typeof body.threadId !== "string") {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const messages = (body.messages as UIMessage[]).slice(-30);
  const modelMessages = await convertToModelMessages(messages);

  const call = createResponsesCall(request, { baseURL: GATEWAY_URL, apiKey, model: MODEL }, modelMessages, instructions());
  return call.response(messages);
}
