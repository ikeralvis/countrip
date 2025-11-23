// app/settings/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { LogOut } from 'lucide-react'
import ColorPicker, { MapColor } from '@/components/ColorPicker'

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [mapColor, setMapColor] = useState<MapColor>('blue')

    useEffect(() => {
        checkUser()
        // Load map color from localStorage
        const savedColor = localStorage.getItem('mapColor') as MapColor
        if (savedColor) {
            setMapColor(savedColor)
        }
    }, [])

    const checkUser = async () => {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        if (currentUser) {
            setProfile({ username: currentUser.email?.split('@')[0] })
        }
        setLoading(false)
    }

    const handleColorChange = async (newColor: MapColor) => {
        setMapColor(newColor)
        // Save to localStorage
        localStorage.setItem('mapColor', newColor)
        // Update CSS variable for immediate effect
        document.documentElement.style.setProperty('--map-color', `var(--color-${newColor})`)
        // Reload page to apply changes
        window.location.reload()
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
    }

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
                <p className="text-gray-400">
                    Inicia sesión para ver la configuración
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[rgb(var(--background))] p-4 pb-20">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Configuración</h1>

                <div className="space-y-4">
                    {/* Perfil */}
                    <div className="bg-[rgb(var(--background-card))] border border-[rgb(var(--border))] rounded-2xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{profile?.username || 'Usuario'}</h3>
                                <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Color del Mapa */}
                    <div className="bg-[rgb(var(--background-card))] border border-[rgb(var(--border))] rounded-2xl p-6">
                        <h3 className="font-semibold text-lg mb-4">Personalización</h3>
                        <ColorPicker selectedColor={mapColor} onChange={handleColorChange} />
                        <p className="text-xs text-gray-500 mt-3">
                            El color se guarda localmente y se aplica al recargar
                        </p>
                    </div>

                    {/* Cerrar sesión */}
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-medium py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut size={20} />
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    )
}