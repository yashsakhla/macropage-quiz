import type {
  AnalysisReport,
  BusinessGoal,
  LeaderboardEntry,
  Participant,
  ParticipantRank,
  QuizQuestion,
  QuizSession,
  SessionState,
} from "./types";
import { API_URL } from "./config";

function getParticipantToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sessionToken");
}

function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken");
}

function clearAdminToken(): void {
  if (typeof window !== "undefined") localStorage.removeItem("adminToken");
}

/** Reads the `exp` claim off a JWT without verifying it — expiry is just a UX hint, the backend still enforces auth. */
function decodeJwtExpiryMs(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof json.exp === "number" ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}

/** True if an admin token is present and not expired. Tokens without a decodable `exp` are treated as valid until the server rejects them. */
export function isAdminTokenValid(): boolean {
  const token = getAdminToken();
  if (!token) return false;
  const expiryMs = decodeJwtExpiryMs(token);
  if (expiryMs === null) return true;
  return Date.now() < expiryMs;
}

export function adminLogout(): void {
  clearAdminToken();
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth: "participant" | "admin" | "none" = "none"
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (auth === "participant") {
    const token = getParticipantToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  } else if (auth === "admin") {
    const token = getAdminToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}/api${path}`, { ...options, headers });

  if (!res.ok) {
    if (res.status === 401 && auth === "admin") clearAdminToken();
    let message = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** Backend returns Mongo-style `_id`; normalize to `id` for the frontend. */
function normalizeId<T extends { id: string }>(obj: T): T {
  const raw = obj as T & { _id?: string };
  return { ...raw, id: raw.id ?? raw._id ?? "" };
}

async function requestWithId<T extends { id: string }>(
  path: string,
  options: RequestInit = {},
  auth: "participant" | "admin" | "none" = "none"
): Promise<T> {
  const data = await request<T>(path, options, auth);
  return normalizeId(data);
}

// ---- Participant ----

export interface RegisterParticipantResponse {
  participantId: string;
  sessionToken: string;
}

export async function registerParticipant(sessionId: string, name: string, whatsappNumber: string) {
  const data = await request<RegisterParticipantResponse & { _id?: string }>("/participants/register", {
    method: "POST",
    body: JSON.stringify({ sessionId, name, whatsappNumber }),
  });
  return { ...data, participantId: data.participantId ?? data._id ?? "" };
}

export async function submitOnboarding(
  participantId: string,
  data: {
    businessName?: string;
    businessCategory?: string;
    goal: BusinessGoal;
    goalOther?: string;
  }
) {
  const result = await request<Participant>(
    `/participants/${participantId}/onboarding`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
    "participant"
  );
  return normalizeId(result);
}

export function submitAnswer(questionId: string, selectedKey: string, timeTakenMs: number) {
  return request(
    "/answers",
    {
      method: "POST",
      body: JSON.stringify({ questionId, selectedKey, timeTakenMs }),
    },
    "participant"
  );
}

export function getParticipantRank(participantId: string) {
  return request<ParticipantRank>(`/participants/${participantId}/rank`);
}

export function requestAnalysis(participantId: string) {
  return request<AnalysisReport>(
    `/participants/${participantId}/analysis`,
    { method: "POST" },
    "participant"
  );
}

export function getAnalysis(participantId: string) {
  return request<AnalysisReport>(`/participants/${participantId}/analysis`);
}

export function getSessionState(sessionId: string, participantId?: string | null) {
  const query = participantId ? `?participantId=${encodeURIComponent(participantId)}` : "";
  return request<SessionState>(`/sessions/${sessionId}/state${query}`);
}

export function getCurrentQuestion(sessionId: string) {
  return requestWithId<QuizQuestion>(`/questions/${sessionId}/current`);
}

/** Fetches the full question set for a session at once, so each participant can self-pace through it after Start Quiz. */
export async function getQuestions(sessionId: string) {
  const rows = await request<Array<QuizQuestion & { _id?: string }>>(
    `/questions/${sessionId}`,
    {},
    "participant"
  );
  return rows.map(normalizeId);
}

export const BUSINESS_CATEGORIES = [
  "Retail / E-commerce",
  "Food & Beverage",
  "Healthcare & Wellness",
  "Professional Services",
  "Education & Training",
  "Manufacturing",
  "Real Estate & Construction",
  "Hospitality & Travel",
  "Beauty & Personal Care",
  "Technology / IT Services",
  "Finance & Insurance",
  "Other",
];

// ---- Admin ----

export interface AdminLoginResponse {
  accessToken: string;
}

export function adminLogin(email: string, password: string) {
  return request<AdminLoginResponse>("/auth/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function createSession(
  title: string,
  options?: { triviaQuestionIds?: string[]; triviaCount?: number }
) {
  const body: Record<string, unknown> = { title };
  if (options?.triviaQuestionIds?.length) body.triviaQuestionIds = options.triviaQuestionIds;
  else if (options?.triviaCount) body.triviaCount = options.triviaCount;

  return requestWithId<QuizSession>(
    "/sessions",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    "admin"
  );
}

export function seedMindsetBank() {
  return request<unknown[]>("/questions/mindset/seed", { method: "POST" }, "admin");
}

export function seedTriviaBank() {
  return request<unknown[]>("/questions/trivia/seed", { method: "POST" }, "admin");
}

export async function listSessions() {
  const rows = await request<Array<QuizSession & { _id?: string }>>("/sessions", {}, "admin");
  return rows.map(normalizeId);
}

export function openRegistration(sessionId: string) {
  return requestWithId<QuizSession>(`/sessions/${sessionId}/open-registration`, { method: "POST" }, "admin");
}

export function startQuiz(sessionId: string) {
  return requestWithId<QuizSession>(`/sessions/${sessionId}/start`, { method: "POST" }, "admin");
}

export function endQuiz(sessionId: string) {
  return requestWithId<QuizSession>(`/sessions/${sessionId}/end`, { method: "POST" }, "admin");
}

export async function getLeaderboard(sessionId: string) {
  const rows = await request<Array<LeaderboardEntry & { _id?: string }>>(
    `/sessions/${sessionId}/leaderboard`,
    {},
    "admin"
  );
  return rows.map((r) => ({ ...r, participantId: r.participantId ?? r._id ?? "" }));
}

export async function listParticipants(sessionId: string) {
  const rows = await request<Participant[]>(`/sessions/${sessionId}/participants`, {}, "admin");
  return rows.map(normalizeId);
}

export async function downloadParticipantsCsv(sessionId: string): Promise<void> {
  const token = getAdminToken();
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}/api/sessions/${sessionId}/export.csv`, { headers });
  if (!res.ok) {
    if (res.status === 401) clearAdminToken();
    throw new Error(`Export failed: ${res.status}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `session-${sessionId}-participants.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export { API_URL, getAdminToken, getParticipantToken };
