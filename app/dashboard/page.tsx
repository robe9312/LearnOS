"use client"

import { useEffect, useState } from "react"
import { curriculum, progress } from "@/lib/api"
import { BookOpen, Clock, ChevronRight, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const session = { user: { id: "test-user-123", name: "Estudiante de Prueba" } }
  const user = session?.user
  const [curricula,  setCurricula]  = useState<any[]>([])
  const [userProgress, setProgress] = useState<any>(null)
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    if (!session?.user?.id) return
    Promise.all([
      curriculum.list(session.user.id, session.user.id),
      progress.get(session.user.id, session.user.id),
    ]).then(([c, p]) => {
      setCurricula(c as any[])
      setProgress(p)
    }).finally(() => setLoading(false))
  }, [session?.user?.id])

  if (loading) return (
    <div id="loading-spinner" className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/10 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div id="dashboard-container" className="min-h-screen bg-black text-neutral-300 w-full p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-light text-white tracking-tight">Hola, {user?.name ?? "Estudiante"}</h1>
          <p className="text-neutral-500 text-sm mt-1">Tu panel de control</p>
        </div>
        <Link
          id="btn-new-course"
          href="/onboarding"
          className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-sm font-medium px-4 py-2 rounded-lg transition-all"
        >
          <Plus className="w-4 h-4 text-cyan-500" />
          Nuevo curso
        </Link>
      </div>

      {userProgress && (
        <div id="stats-grid" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div id="stat-completed" className="bg-neutral-950 border border-neutral-900 rounded-lg p-5">
            <div className="text-3xl font-light text-cyan-500">{userProgress.completed}</div>
            <div className="text-neutral-500 text-xs uppercase tracking-wider mt-1">Skills</div>
          </div>
          <div id="stat-progress" className="bg-neutral-950 border border-neutral-900 rounded-lg p-5">
            <div className="text-3xl font-light text-neutral-100">{userProgress.completion_pct}%</div>
            <div className="text-neutral-500 text-xs uppercase tracking-wider mt-1">Completado</div>
          </div>
          <div id="stat-inprogress" className="bg-neutral-950 border border-neutral-900 rounded-lg p-5">
            <div className="text-3xl font-light text-neutral-100">{userProgress.in_progress}</div>
            <div className="text-neutral-500 text-xs uppercase tracking-wider mt-1">En curso</div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-6">Tus currículos</h2>

        {curricula.length === 0 ? (
          <div id="empty-state" className="bg-neutral-950 border border-neutral-900 border-dashed rounded-lg p-16 text-center">
            <BookOpen className="w-12 h-12 text-neutral-800 mx-auto mb-6" />
            <p className="text-neutral-500 mb-8 text-lg font-light">Aún no tienes ningún currículo activo.</p>
            <Link
              id="btn-create-first"
              href="/onboarding"
              className="inline-flex items-center gap-2 bg-cyan-950 border border-cyan-900 text-cyan-200 font-medium px-6 py-3 rounded-lg hover:bg-cyan-900 transition-all"
            >
              <Plus className="w-4 h-4" />
              Crear currículo
            </Link>
          </div>
        ) : (
          <div id="curricula-list" className="space-y-3">
            {curricula.map((c: any) => (
              <Link
                key={c.id}
                id={`link-curriculum-${c.id}`}
                href={`/curriculum/${c.id}`}
                className="flex items-center justify-between bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 rounded-lg p-5 transition-all group"
              >
                <div className="flex items-center gap-5 min-w-0">
                  <div className="shrink-0 w-10 h-10 rounded bg-neutral-900 flex items-center justify-center text-neutral-600 group-hover:text-cyan-500 transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-neutral-200 text-lg truncate">{c.goal}</div>
                    <div className="text-neutral-600 text-xs mt-1 flex items-center gap-4">
                        <span className="uppercase tracking-wide">{c.total_weeks} semanas</span>
                        <span className="uppercase tracking-wide text-neutral-700">{c.status}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="shrink-0 w-5 h-5 text-neutral-800 group-hover:text-neutral-500 transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
