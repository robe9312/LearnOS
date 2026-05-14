"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { curriculum, progress } from "@/lib/api"
import { BookOpen, Clock, ChevronRight, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useUser()
  const [curricula,  setCurricula]  = useState<any[]>([])
  const [userProgress, setProgress] = useState<any>(null)
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    if (!user?.id) return
    Promise.all([
      curriculum.list(user.id),
      progress.get(user.id),
    ]).then(([c, p]) => {
      setCurricula(c as any[])
      setProgress(p)
    }).finally(() => setLoading(false))
  }, [user?.id])

  if (loading) return (
    <div id="loading-spinner" className="min-h-screen bg-[#121212] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-[#FF0000] rounded-full animate-spin" />
    </div>
  )

  return (
    <div id="dashboard-container" className="min-h-screen bg-[#121212] text-[#F5F5F5] p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Hola, {user?.firstName ?? "Estudiante"} 👋</h1>
          <p className="text-white/40 text-sm mt-1">Tu panel de aprendizaje</p>
        </div>
        <Link
          id="btn-new-course"
          href="/onboarding"
          className="flex items-center gap-2 bg-[#FF0000] hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo curso
        </Link>
      </div>

      {userProgress && (
        <div id="stats-grid" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div id="stat-completed" className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-[#FF0000]">{userProgress.completed}</div>
            <div className="text-white/50 text-sm mt-1">Skills completados</div>
          </div>
          <div id="stat-progress" className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-white">{userProgress.completion_pct}%</div>
            <div className="text-white/50 text-sm mt-1">Progreso total</div>
          </div>
          <div id="stat-inprogress" className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-white">{userProgress.in_progress}</div>
            <div className="text-white/50 text-sm mt-1">En progreso</div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">Tus currículos</h2>

        {curricula.length === 0 ? (
          <div id="empty-state" className="bg-white/5 border border-white/10 border-dashed rounded-xl p-12 text-center">
            <BookOpen className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 mb-4">Aún no tienes ningún currículo.</p>
            <Link
              id="btn-create-first"
              href="/onboarding"
              className="inline-flex items-center gap-2 bg-[#FF0000] hover:bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear mi primer currículo
            </Link>
          </div>
        ) : (
          <div id="curricula-list" className="space-y-3">
            {curricula.map((c: any) => (
              <Link
                key={c.id}
                id={`link-curriculum-${c.id}`}
                href={`/curriculum/${c.id}`}
                className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#FF0000]/20 flex items-center justify-center text-[#FF0000]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{c.goal}</div>
                    <div className="text-white/40 text-sm flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {c.total_weeks} semanas
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
