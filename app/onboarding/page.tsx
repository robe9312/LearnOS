"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
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
  const { data: session } = useSession()
  const user = session?.user

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
        display_name:         user.name ?? "Estudiante",
        language:             "es",
        hours_per_week:       hours,
        goal_description:     goal,
        self_assessed_level:  level as any,
      }, user.id!)

      await curriculum.generate({
        user_id:       user.id!,
        topic:         goal,
        level:         level as any,
        hours_per_week: hours,
        language:      "es",
      }, user.id!)

      router.push("/dashboard")
    } catch (e: any) {
      setError(e.message ?? "Algo salió mal. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="onboarding-container" className="min-h-screen bg-black text-stone-300 w-full flex items-center justify-center p-4 overflow-x-hidden">
      <div className="w-full max-w-lg">
        <div className="flex gap-1 mb-10">
          {STEPS.map((s, i) => (
            <div
              key={s}
              id={`progress-bar-${s}`}
              className={`h-0.5 flex-1 transition-all duration-300 ${
                i <= stepIndex ? "bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" : "bg-stone-800"
              }`}
            />
          ))}
        </div>

        {step === "objetivo" && (
          <div id="step-objetivo" className="space-y-6">
            <div>
              <h1 className="text-3xl font-light text-white mb-2 tracking-tight">¿Qué quieres aprender?</h1>
              <p className="text-stone-500 text-sm">Define tu objetivo técnico.</p>
            </div>

            <textarea
              id="goal-input"
              className="w-full bg-stone-950 border border-stone-800 rounded-lg p-4 text-stone-100 placeholder-stone-700 resize-none h-32 focus:outline-none focus:border-red-900 transition-colors"
              placeholder="Ej: Aprender Web3..."
              value={goal}
              onChange={e => setGoal(e.target.value)}
              maxLength={300}
            />

            <div className="flex justify-between items-center text-xs text-stone-600">
              <span id="error-goal-message" className="text-red-700">{error}</span>
              <span>{goal.length}/300</span>
            </div>

            <button
              id="btn-goal-next"
              onClick={handleGoalNext}
              disabled={!goal.trim()}
              className="w-full bg-stone-900 hover:bg-stone-800 border border-stone-800 disabled:opacity-30 disabled:cursor-not-allowed text-stone-200 font-medium py-3 rounded-lg transition-colors"
            >
              Continuar
            </button>
          </div>
        )}

        {step === "nivel" && (
          <div id="step-nivel" className="space-y-6">
            <div>
              <h1 className="text-3xl font-light text-white mb-2 tracking-tight">¿Cuál es tu nivel?</h1>
            </div>

            <div className="space-y-3">
              {LEVELS.map(l => (
                <button
                  key={l.value}
                  id={`btn-level-${l.value}`}
                  onClick={() => setLevel(l.value)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    level === l.value
                      ? "border-red-900 bg-stone-900"
                      : "border-stone-800 bg-stone-950 hover:border-stone-700"
                  }`}
                >
                  <div className="font-medium text-stone-100">{l.label}</div>
                  <div className="text-sm text-stone-500 mt-0.5">{l.desc}</div>
                </button>
              ))}
            </div>

            {error && <p id="error-level-message" className="text-red-700 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button
                id="btn-level-back"
                onClick={() => setStep("objetivo")}
                className="flex-1 bg-stone-950 border border-stone-800 text-stone-500 py-3 rounded-lg hover:border-stone-700 transition-colors"
              >
                Atrás
              </button>
              <button
                id="btn-level-next"
                onClick={handleLevelNext}
                disabled={!level}
                className="flex-1 bg-stone-900 border border-red-900 text-red-500 font-medium py-3 rounded-lg hover:bg-stone-800 transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === "tiempo" && (
          <div id="step-tiempo" className="space-y-6">
            <div>
              <h1 className="text-3xl font-light text-white mb-2 tracking-tight">Capacidad semanal</h1>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {HOURS.map(h => (
                <button
                  key={h}
                  id={`btn-hours-${h}`}
                  onClick={() => setHours(h)}
                  className={`py-3 rounded-lg border font-medium text-sm transition-all ${
                    hours === h
                      ? "border-red-900 bg-stone-900 text-red-500"
                      : "border-stone-800 bg-stone-950 text-stone-500 hover:border-stone-700"
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>

            <div className="bg-stone-950 border border-stone-800 rounded-lg p-4 text-sm text-stone-500">
              El sistema optimizará el ritmo para <span className="text-stone-300 font-medium">{hours}h/semana</span>.
            </div>

            {error && <p id="error-time-message" className="text-red-700 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button
                id="btn-time-back"
                onClick={() => setStep("nivel")}
                className="flex-1 bg-stone-950 border border-stone-800 text-stone-500 py-3 rounded-lg hover:border-stone-700 transition-colors"
              >
                Atrás
              </button>
              <button
                id="btn-submit"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-red-950 border border-red-900 text-red-300 font-semibold py-3 rounded-lg hover:bg-red-900 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? "Generando..." : "Generar currículo"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
