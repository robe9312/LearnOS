"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { onboarding, curriculum } from "@/lib/api"

const STEPS = ["objetivo", "nivel", "tiempo"] as const
type Step = typeof STEPS[number]

const LEVELS = [
  { value: "beginner",     label: "Principiante", desc: "Estoy empezando desde cero" },
  { value: "intermediate", label: "Intermedio",   desc: "Tengo bases, quiero profundizar" },
  { value: "advanced",     label: "Avanzado",     desc: "Quiero dominar el tema" },
]

const HOURS = [2, 5, 10, 15, 20]

export default function OnboardingPage() {
  const router  = useRouter()
  const { user } = useUser()

  const [step,       setStep]       = useState<Step>("objetivo")
  const [goal,       setGoal]       = useState("")
  const [level,      setLevel]      = useState<string>("")
  const [hours,      setHours]      = useState<number>(5)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  const stepIndex = STEPS.indexOf(step)

  async function handleGoalNext() {
    if (!goal.trim() || goal.length < 10) {
      setError("Describe tu objetivo con un poco más de detalle.")
      return
    }
    setError(null)
    setStep("nivel")
  }

  function handleLevelNext() {
    if (!level) { setError("Selecciona tu nivel."); return }
    setError(null)
    setStep("tiempo")
  }

  async function handleSubmit() {
    if (!user) return
    setLoading(true)
    setError(null)

    try {
      await onboarding.start({
        user_id:              user.id,
        display_name:         user.fullName ?? user.username ?? "Estudiante",
        language:             "es",
        hours_per_week:       hours,
        goal_description:     goal,
        self_assessed_level:  level as any,
      })

      await curriculum.generate({
        user_id:       user.id,
        topic:         goal,
        level:         level as any,
        hours_per_week: hours,
        language:      "es",
      })

      router.push("/dashboard")
    } catch (e: any) {
      setError(e.message ?? "Algo salió mal. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="onboarding-container" className="min-h-screen bg-[#121212] text-[#F5F5F5] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div
              key={s}
              id={`progress-bar-${s}`}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= stepIndex ? "bg-[#FF0000]" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {step === "objetivo" && (
          <div id="step-objetivo" className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">¿Qué quieres aprender?</h1>
              <p className="text-white/50 text-sm">Descríbelo con tus palabras.</p>
            </div>

            <textarea
              id="goal-input"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 resize-none h-32 focus:outline-none focus:border-[#FF0000] transition-colors"
              placeholder="Ej: Quiero aprender a crear aplicaciones web..."
              value={goal}
              onChange={e => setGoal(e.target.value)}
              maxLength={300}
            />

            <div className="flex justify-between items-center text-xs text-white/30">
              <span id="error-goal-message" className="text-[#FF0000]">{error}</span>
              <span>{goal.length}/300</span>
            </div>

            <button
              id="btn-goal-next"
              onClick={handleGoalNext}
              disabled={!goal.trim()}
              className="w-full bg-[#FF0000] hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Continuar →
            </button>
          </div>
        )}

        {step === "nivel" && (
          <div id="step-nivel" className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">¿Cuál es tu nivel?</h1>
            </div>

            <div className="space-y-3">
              {LEVELS.map(l => (
                <button
                  key={l.value}
                  id={`btn-level-${l.value}`}
                  onClick={() => setLevel(l.value)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    level === l.value
                      ? "border-[#FF0000] bg-[#FF0000]/10"
                      : "border-white/10 bg-white/5 hover:border-white/30"
                  }`}
                >
                  <div className="font-semibold">{l.label}</div>
                  <div className="text-sm text-white/50 mt-0.5">{l.desc}</div>
                </button>
              ))}
            </div>

            {error && <p id="error-level-message" className="text-[#FF0000] text-sm">{error}</p>}

            <div className="flex gap-3">
              <button
                id="btn-level-back"
                onClick={() => setStep("objetivo")}
                className="flex-1 border border-white/10 text-white/70 py-3 rounded-xl hover:border-white/30 transition-colors"
              >
                ← Atrás
              </button>
              <button
                id="btn-level-next"
                onClick={handleLevelNext}
                disabled={!level}
                className="flex-1 bg-[#FF0000] hover:bg-red-600 disabled:opacity-30 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {step === "tiempo" && (
          <div id="step-tiempo" className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">¿Cuánto tiempo tienes?</h1>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {HOURS.map(h => (
                <button
                  key={h}
                  id={`btn-hours-${h}`}
                  onClick={() => setHours(h)}
                  className={`py-4 rounded-xl border font-bold text-lg transition-all ${
                    hours === h
                      ? "border-[#FF0000] bg-[#FF0000]/10 text-white"
                      : "border-white/10 bg-white/5 text-white/50 hover:border-white/30"
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>

            {error && <p id="error-time-message" className="text-[#FF0000] text-sm">{error}</p>}

            <div className="flex gap-3">
              <button
                id="btn-time-back"
                onClick={() => setStep("nivel")}
                className="flex-1 border border-white/10 text-white/70 py-3 rounded-xl hover:border-white/30 transition-colors"
              >
                ← Atrás
              </button>
              <button
                id="btn-submit"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-[#FF0000] hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? "Generando..." : "Generar mi currículo →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
