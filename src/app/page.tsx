// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase, getCurrentUser } from '@/lib/supabase'
import dynamic from 'next/dynamic'
import AddTripModal from '@/components/AddTripModal'
import AuthModal from '@/components/AuthModal'
import StatsCard from '@/components/StatsCard'
import { Plus } from 'lucide-react'
import { Visit } from '@/lib/types'
import WorldMap from '@/components/WorldMap'


export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [visits, setVisits] = useState<Visit[]>([])
  const [showAddTrip, setShowAddTrip] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mapColor, setMapColor] = useState('blue')

  useEffect(() => {
    checkUser()
    // Load map color from localStorage
    const savedColor = localStorage.getItem('mapColor') || 'blue'
    setMapColor(savedColor)
    // Apply to CSS variable
    document.documentElement.style.setProperty('--map-color', `var(--color-${savedColor})`)

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadVisits(session.user.id)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    if (currentUser) {
      await loadVisits(currentUser.id)
    }
    setLoading(false)
  }

  const loadVisits = async (userId: string) => {
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (!error && data) {
      setVisits(data)
    }
  }

  const visitedCountries = Array.from(
    new Set(visits.map((v) => v.country_code))
  )

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-black p-4">
        <div className="h-screen flex flex-col items-center justify-center p-4 md:p-8">
          <div className="text-center max-w-md mx-auto space-y-8">
            <img
              src="/logoInicio.png"
              alt="Countrip"
              className="w-32 h-32 mx-auto mb-4"
            />
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Countrip
            </h1>
            <p className="text-gray-400 text-lg">
              Registra y visualiza todos los lugares que has visitado
            </p>
            <button
              onClick={() => setShowAuth(true)}
              className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Comenzar Ahora
            </button>
          </div>
          {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen relative overflow-hidden">
      <WorldMap visitedCountries={visitedCountries} visits={visits} mapColor={mapColor} />

      <div className="absolute top-0 left-0 right-0 p-3 md:p-4 z-10 pointer-events-none">
        <div className="w-full flex items-start justify-between gap-2 md:gap-4">
          <div className="flex-shrink min-w-0">
            <StatsCard visitedCount={visitedCountries.length} />
          </div>

          <button
            onClick={() => setShowAddTrip(true)}
            className="flex-shrink-0 bg-white text-black border-2 border-white rounded-lg p-2 md:p-3 transition-all hover:bg-black hover:text-white pointer-events-auto shadow-lg"
            title="Añadir viaje"
          >
            <Plus size={20} strokeWidth={2.5} className="md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {showAddTrip && user && (
        <AddTripModal
          onClose={() => setShowAddTrip(false)}
          onSuccess={() => loadVisits(user.id)}
          userId={user.id}
        />
      )}
    </div>
  )
}