// app/trips/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { Visit } from '@/lib/types'
import { Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function TripsPage() {
    const [user, setUser] = useState<any>(null)
    const [visits, setVisits] = useState<Visit[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkUser()
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
            .order('date', { ascending: false, nullsFirst: false })

        if (!error && data) {
            setVisits(data)
        }
    }

    const deleteVisit = async (id: string) => {
        if (!confirm('¿Eliminar este viaje?')) return

        const { error } = await supabase
            .from('visits')
            .delete()
            .eq('id', id)

        if (!error && user) {
            loadVisits(user.id)
        }
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Sin fecha'
        try {
            return format(new Date(dateString), 'MMMM yyyy', { locale: es })
        } catch {
            return 'Fecha inválida'
        }
    }

    // Group visits by year-month
    const groupedVisits = visits.reduce((acc, visit) => {
        const key = visit.date ? format(new Date(visit.date), 'yyyy-MM') : 'sin-fecha'
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(visit)
        return acc
    }, {} as Record<string, Visit[]>)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--background))]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-[rgb(var(--background))]">
                <div className="text-center">
                    <p className="text-gray-400">
                        Inicia sesión para ver tus viajes
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[rgb(var(--background))] p-4 pb-20">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Mis Viajes</h1>
                    <p className="text-gray-400 mt-1">
                        {visits.length} {visits.length === 1 ? 'viaje registrado' : 'viajes registrados'}
                    </p>
                </div>

                {visits.length === 0 ? (
                    <div className="bg-[rgb(var(--background-card))] border border-[rgb(var(--border))] rounded-2xl p-12 text-center">
                        <div className="text-6xl mb-4">✈️</div>
                        <h3 className="text-xl font-semibold mb-2">No hay viajes aún</h3>
                        <p className="text-gray-400">
                            Añade tu primer viaje desde el mapa
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedVisits)
                            .sort(([a], [b]) => b.localeCompare(a))
                            .map(([dateKey, groupVisits]) => (
                                <div key={dateKey}>
                                    <h2 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
                                        {dateKey === 'sin-fecha' ? 'Sin fecha' : format(new Date(dateKey + '-01'), 'MMMM yyyy', { locale: es })}
                                    </h2>
                                    <div className="space-y-2">
                                        {groupVisits.map((visit) => (
                                            <div
                                                key={visit.id}
                                                className="bg-[rgb(var(--background-card))] border border-[rgb(var(--border))] rounded-xl p-4 hover:border-gray-600 transition-all group"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0 space-y-1">
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="font-semibold text-white">
                                                                {visit.country_name || visit.country_code}
                                                            </span>
                                                            {visit.emojis && (
                                                                <span className="text-sm">{visit.emojis}</span>
                                                            )}
                                                        </div>

                                                        {visit.city_name && (
                                                            <p className="text-sm text-gray-400">
                                                                {visit.city_name}
                                                            </p>
                                                        )}

                                                        {visit.duration && (
                                                            <p className="text-xs text-gray-500">
                                                                {visit.duration}
                                                            </p>
                                                        )}

                                                        {visit.notes && (
                                                            <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                                                                {visit.notes}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => deleteVisit(visit.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    )
}