# MACROPAGE Business Quiz — Frontend

Next.js (App Router) frontend for the live business-readiness quiz. One repo, three
surfaces: participant quiz, projector display, admin control panel.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- socket.io-client for real-time question push / leaderboard
- TanStack Query for REST calls
- `qrcode.react` for the display screen's join QR

## Local dev

```bash
npm install
cp .env.example .env.local   # point at your backend
npm run dev
```

Env vars (see `.env.example`):

- `NEXT_PUBLIC_API_URL` — REST base URL of the quiz backend
- `NEXT_PUBLIC_SOCKET_URL` — Socket.IO base URL (usually the same host)
- `NEXT_PUBLIC_USE_MOCK` — `true` by default; runs the whole app against an
  in-browser mock instead of a real backend (see below)

## Mock mode (no backend yet)

The real backend isn't live yet, so by default (`NEXT_PUBLIC_USE_MOCK=true`) every
route runs against `lib/mock/store.ts`: a small in-browser "backend" that persists
state to `localStorage` and syncs across tabs with `BroadcastChannel`, so you can
open the participant flow, `/display/<id>`, and the admin control room in separate
tabs and see them react to each other live, exactly like the real event would.

- From `/`, hit **Try the demo quiz** to join a pre-seeded `demo` session (already
  in "registration open" status with 5 default questions).
- Log into `/admin/login` with any non-empty email/password, open the `demo`
  session under `/admin/sessions`, and use **Start Quiz** / **End Quiz** to
  drive the same session the participant tab is sitting in. Once started,
  each participant self-paces through every question on their own device.
- `POST /participants/:id/analysis` is simulated with a ~2.5s delay so the "AI
  thinking" sequence on `/results/analysis` plays out fully.

Once the real backend is ready, set `NEXT_PUBLIC_USE_MOCK=false` and point
`NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_SOCKET_URL` at it — no other code changes
needed, since every screen goes through `lib/api.ts` / `lib/socket.ts`.

## Shared code

- `lib/api.ts` — REST client, used by all three surfaces (delegates to
  `lib/mock/store.ts` while `NEXT_PUBLIC_USE_MOCK=true`)
- `lib/socket.ts` — Socket.IO client singleton (or the mock socket in mock mode)
- `lib/useQuizSocket.ts` — shared hook that joins a session room with a role
  (`participant` / `display` / `admin`) and re-syncs REST state on reconnect
- `lib/types.ts` — shared domain types
- `lib/mock/` — in-browser mock backend used until the real API is ready

## Routes

### Participant (mobile, no login)

- `/join?session=<id>` → `/onboarding` → `/waiting` → `/quiz` → `/results` →
  `/results/analysis`

### Display (projector, no login)

- `/display/[sessionId]` — QR + join counter before start, live leaderboard during
  the quiz, final podium after `quiz:ended`

### Admin (`/admin/*`, JWT-protected)

- `/admin/login`
- `/admin/sessions` — list + create sessions
- `/admin/sessions/[id]` — control room (Open Registration / Start Quiz /
  End Quiz), live leaderboard, participants table + CSV export

## Event day: which device opens what

| Device | URL |
| --- | --- |
| Laptop plugged into projector | `/display/<sessionId>` |
| Host's phone/tablet | `/admin/sessions/<id>` (control room) |
| Attendees' phones (via QR on screen) | `/join?session=<id>` |

Flow for the host:

1. Log in at `/admin/login`, create a session at `/admin/sessions`.
2. Open `/display/<sessionId>` on the projector laptop — it shows the join QR.
3. On the control room, hit **Open Registration** so participants can join.
4. Once enough people have scanned in, hit **Start Quiz** — every participant
   pulls the full question set and races through it on their own device at
   their own pace, no per-question control from the admin.
5. Hit **End Quiz** once the round is over (typically within a minute) — the
   display flips to the final leaderboard and participants land on their
   personal results + AI analysis.
6. Use the **Participants** tab to export the CSV lead list after the event.

## Notes

- Participant session state (`participantId`, `sessionToken`, `sessionId`) is kept in
  `localStorage` so a refreshed/reloaded phone resumes at the right screen via
  `GET /sessions/:id/state`.
- Mobile-first routes are designed for 360–430px widths; `/display` is designed for
  16:9 large-screen projection.
