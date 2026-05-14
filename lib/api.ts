const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

// ─── Cliente base ────────────────────────────────
async function apiFetch<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {

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
  start: (data: any, token: string) => apiFetch("/onboarding", token, { method: "POST", body: JSON.stringify(data) }),
  status: (userId: string, token: string) => apiFetch(`/onboarding/status/${userId}`, token),
}

// ─── Curriculum ──────────────────────────────────
export const curriculum = {
  generate: (data: any, token: string) => apiFetch("/curriculum/generate", token, { method: "POST", body: JSON.stringify(data) }),
  list: (userId: string, token: string) => apiFetch(`/curriculum/user/${userId}`, token),
  get: (id: string, token: string) => apiFetch(`/curriculum/${id}`, token),
  updateStatus: (id: string, status: string, token: string) => apiFetch(`/curriculum/${id}/status?status=${status}`, token, { method: "PATCH" }),
}

// ─── Progreso ────────────────────────────────────
export const progress = {
  get: (userId: string, token: string) => apiFetch(`/progress/${userId}`, token),
  update: (data: any, token: string) => apiFetch("/progress/update", token, { method: "POST", body: JSON.stringify(data) }),
}

// ─── Quiz ────────────────────────────────────────
export const quiz = {
  generate: (data: any, token: string) => apiFetch("/quiz/generate", token, { method: "POST", body: JSON.stringify(data) }),
  submit: (data: any, token: string) => apiFetch("/quiz/submit", token, { method: "POST", body: JSON.stringify(data) }),
  gapRepair: (userId: string, skillId: string, token: string) => apiFetch(`/quiz/gap-repair/${userId}?skill_id=${skillId}`, token),
}

// ─── Skills ──────────────────────────────────────
export const skills = {
  list: (token: string) => apiFetch("/skills", token),
}
