import { auth } from "@clerk/nextjs/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

// ─── Cliente base ────────────────────────────────
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const { getToken } = await auth()
  const token = await getToken()

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(error.detail ?? "Error en el servidor")
  }

  return res.json()
}

// ─── Onboarding ──────────────────────────────────
export const onboarding = {
  start: (data: {
    user_id: string
    display_name: string
    language: "es" | "en"
    hours_per_week: number
    goal_description: string
    self_assessed_level?: "beginner" | "intermediate" | "advanced"
  }) => apiFetch("/onboarding", { method: "POST", body: JSON.stringify(data) }),

  status: (userId: string) =>
    apiFetch(`/onboarding/status/${userId}`),
}

// ─── Curriculum ──────────────────────────────────
export const curriculum = {
  generate: (data: {
    user_id: string
    topic: string
    level: "beginner" | "intermediate" | "advanced"
    hours_per_week: number
    goal?: string
    language: "es" | "en"
  }) => apiFetch("/curriculum/generate", { method: "POST", body: JSON.stringify(data) }),

  list: (userId: string) =>
    apiFetch(`/curriculum/user/${userId}`),

  get: (id: string) =>
    apiFetch(`/curriculum/${id}`),

  updateStatus: (id: string, status: "active" | "paused" | "completed") =>
    apiFetch(`/curriculum/${id}/status?status=${status}`, { method: "PATCH" }),
}

// ─── Progreso ────────────────────────────────────
export const progress = {
  get: (userId: string) =>
    apiFetch(`/progress/${userId}`),

  update: (data: {
    user_id: string
    skill_id: string
    status: "in_progress" | "completed"
    score?: number
  }) => apiFetch("/progress/update", { method: "POST", body: JSON.stringify(data) }),
}

// ─── Quiz ────────────────────────────────────────
export const quiz = {
  generate: (data: {
    user_id: string
    skill_id: string
    num_questions?: number
  }) => apiFetch("/quiz/generate", { method: "POST", body: JSON.stringify(data) }),

  submit: (data: {
    user_id: string
    skill_id: string
    answers: { quiz_id: string; selected_option: number }[]
  }) => apiFetch("/quiz/submit", { method: "POST", body: JSON.stringify(data) }),

  gapRepair: (userId: string, skillId: string) =>
    apiFetch(`/quiz/gap-repair/${userId}?skill_id=${skillId}`),
}

// ─── Skills ──────────────────────────────────────
export const skills = {
  list: () => apiFetch("/skills"),
}
