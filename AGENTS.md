<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- All document content (names, links, fees, steps) lives in `src/data/documents.ts`; cards, guide pages, tracker and the AI prompt all read from it — edit data there, never inline in components.
- Tracker progress, date of birth and Saathi chat threads are stored in browser localStorage (no login); chat threads each have a `/assistant/$threadId` page rendered client-only (`ssr: false`).
- Saathi AI streams through the server route `src/routes/api/chat.ts` (Lovable AI Gateway, Responses API); voice in/out uses the browser Web Speech API so it costs nothing extra.
- Design tokens (Midnight Gold palette, fonts, gold/guilloche/certificate utilities, button variants gold/glass/teal) live in `src/styles.css` and `src/components/ui/button.tsx`; components use only those tokens.
