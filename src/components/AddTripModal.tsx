// components/AddTripModal.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { X, Search } from 'lucide-react'
import { COUNTRIES } from '@/lib/countries'

interface AddTripModalProps {
    onClose: () => void
    onSuccess: () => void
    userId: string
}

export default function AddTripModal({ onClose, onSuccess, userId }: AddTripModalProps) {
    const [countryCode, setCountryCode] = useState('')
    const [cityName, setCityName] = useState('')
    const [month, setMonth] = useState('')
    const [year, setYear] = useState(new Date().getFullYear().toString())
    const [duration, setDuration] = useState('')
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)

    const filteredCountries = searchTerm.length > 0
        ? COUNTRIES.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 10)
        : []

    const selectedCountry = COUNTRIES.find(c => c.code === countryCode)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const country = COUNTRIES.find(c => c.code === countryCode)

            // Geocoding logic
            let lat = null
            let lng = null

            if (cityName && country) {
                try {
                    const query = `${cityName}, ${country.name}`
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
                    const data = await response.json()

                    if (data && data.length > 0) {
                        lat = parseFloat(data[0].lat)
                        lng = parseFloat(data[0].lon)
                    }
                } catch (geoError) {
                    console.error('Error geocoding city:', geoError)
                }
            }

            // Create date string from month and year if provided
            let dateString = null
            if (month && year) {
                dateString = `${year}-${month.padStart(2, '0')}-01`
            }

            const { error: insertError } = await supabase.from('visits').insert({
                user_id: userId,
                country_code: countryCode,
                country_name: country?.name || countryCode,
                city_name: cityName || null,
                date: dateString,
                duration: duration || null,
                notes: notes || null,
                lat: lat,
                lng: lng,
            })

            if (insertError) throw insertError

            onSuccess()
            onClose()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const months = [
        { value: '1', label: 'Enero' },
        { value: '2', label: 'Febrero' },
        { value: '3', label: 'Marzo' },
        { value: '4', label: 'Abril' },
        { value: '5', label: 'Mayo' },
        { value: '6', label: 'Junio' },
        { value: '7', label: 'Julio' },
        { value: '8', label: 'Agosto' },
        { value: '9', label: 'Septiembre' },
        { value: '10', label: 'Octubre' },
        { value: '11', label: 'Noviembre' },
        { value: '12', label: 'Diciembre' },
    ]

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 p-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Añadir Viaje</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Country Search */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            País *
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                value={selectedCountry ? selectedCountry.name : searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    setCountryCode('')
                                    setShowDropdown(true)
                                }}
                                onFocus={() => setShowDropdown(true)}
                                placeholder="Buscar país..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                                required
                            />
                        </div>

                        {showDropdown && filteredCountries.length > 0 && !selectedCountry && (
                            <div className="absolute z-10 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                {filteredCountries.map((country) => (
                                    <button
                                        key={country.code}
                                        type="button"
                                        onClick={() => {
                                            setCountryCode(country.code)
                                            setSearchTerm('')
                                            setShowDropdown(false)
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-white/5 text-white transition-colors border-b border-white/5 last:border-0"
                                    >
                                        <div className="font-medium">{country.name}</div>
                                        <div className="text-xs text-gray-500">{country.continent}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Ciudad (opcional)
                        </label>
                        <input
                            type="text"
                            value={cityName}
                            onChange={(e) => setCityName(e.target.value)}
                            placeholder="Ej: Madrid, París..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>

                    {/* Date */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Mes
                            </label>
                            <select
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                            >
                                <option value="">Mes</option>
                                {months.map((m) => (
                                    <option key={m.value} value={m.value} className="bg-[#1a1a1a]">
                                        {m.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Año
                            </label>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                            >
                                {years.map((y) => (
                                    <option key={y} value={y} className="bg-[#1a1a1a]">
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Duración (días)
                        </label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="Ej: 7"
                            min="1"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Notas (opcional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Añade tus recuerdos..."
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !countryCode}
                            className="flex-1 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}