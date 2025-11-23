// components/WorldMap.tsx
'use client'

import React, { useState, useEffect, memo } from 'react'
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Marker
} from 'react-simple-maps'
import { Tooltip } from 'react-tooltip'
import { Visit } from '@/lib/types'
import { Globe, Map as MapIcon } from 'lucide-react'
import { ISO_TO_NUMERIC } from '@/lib/iso-to-numeric'

// URL del GeoJSON de topología mundial (optimizado para web)
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

interface WorldMapProps {
    visitedCountries: string[]
    visits: Visit[]
    mapColor?: string
}

// Helper para convertir colores CSS
const getColorFromCSSVar = (colorVar: string): string => {
    const colors: Record<string, string> = {
        'blue': '#93c5fd',
        'green': '#86efac',
        'purple': '#c4b5fd',
        'pink': '#fbcfe8',
        'orange': '#fdba74',
    }
    return colors[colorVar] || colors['blue']
}

// Definición de continentes y sus coordenadas/zoom
const CONTINENTS = {
    world: { center: [0, 20], zoom: 1, name: "Mundo" },
    europe: { center: [10, 50], zoom: 4, name: "Europa" },
    asia: { center: [90, 30], zoom: 3, name: "Asia" },
    africa: { center: [20, 0], zoom: 3, name: "África" },
    northAmerica: { center: [-100, 40], zoom: 3, name: "Norteamérica" },
    southAmerica: { center: [-60, -20], zoom: 3, name: "Sudamérica" },
    oceania: { center: [140, -25], zoom: 3, name: "Oceanía" },
}

const WorldMap = ({ visitedCountries, visits, mapColor = 'blue' }: WorldMapProps) => {
    const [tooltipContent, setTooltipContent] = useState("")
    const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 })
    const color = getColorFromCSSVar(mapColor)

    // Convertir códigos ISO a numéricos para comparación
    const visitedNumericIds = visitedCountries.map(iso => ISO_TO_NUMERIC[iso]).filter(Boolean)

    // Cargar zona guardada y ajustar zoom inicial
    useEffect(() => {
        const savedZone = localStorage.getItem('mapZone') || 'world'
        const isMobile = window.innerWidth < 768

        const config = CONTINENTS[savedZone as keyof typeof CONTINENTS]
        if (config) {
            setPosition({
                coordinates: config.center as [number, number],
                zoom: isMobile ? config.zoom * 1.2 : config.zoom
            })
        }
    }, [])

    const handleContinentChange = (continentKey: string) => {
        const config = CONTINENTS[continentKey as keyof typeof CONTINENTS]
        if (config) {
            const isMobile = window.innerWidth < 768
            setPosition({
                coordinates: config.center as [number, number],
                zoom: isMobile ? config.zoom * 1.2 : config.zoom
            })
            // Guardar preferencia
            localStorage.setItem('mapZone', continentKey)
        }
    }

    // Get unique cities with coordinates
    const citiesWithCoords = visits.filter(v => v.lat && v.lng)

    return (
        <div className="w-full h-full bg-[#0a0a0a] relative">
            {/* Continent Selector - Moved to bottom-left */}
            <div className="absolute bottom-20 left-4 z-20 flex flex-col gap-2">
                <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-lg p-2 flex flex-col gap-1 shadow-xl">
                    <span className="text-xs text-gray-400 px-2 mb-1 uppercase tracking-wider font-bold">Zona</span>
                    {Object.entries(CONTINENTS).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => handleContinentChange(key)}
                            className="text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-white/10 rounded-md transition-colors flex items-center gap-2"
                        >
                            {key === 'world' ? <Globe size={14} /> : <MapIcon size={14} />}
                            {config.name}
                        </button>
                    ))}
                </div>
            </div>

            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 100
                }}
                className="w-full h-full"
            >
                <ZoomableGroup
                    center={position.coordinates as [number, number]}
                    zoom={position.zoom}
                    onMoveEnd={(pos) => setPosition(pos)}
                    minZoom={0.8}
                    maxZoom={15}
                    translateExtent={[[-1000, -500], [1000, 500]]}
                >
                    <Geographies geography={GEO_URL}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                // Usar el ID numérico del GeoJSON
                                const geoId = geo.id

                                // Verificar si este país ha sido visitado
                                const isVisited = visitedNumericIds.includes(geoId)

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onMouseEnter={() => {
                                            setTooltipContent(`${geo.properties.name}`)
                                        }}
                                        onMouseLeave={() => {
                                            setTooltipContent("")
                                        }}
                                        style={{
                                            default: {
                                                fill: isVisited ? color : "#2a2a2a",
                                                stroke: "#1a1a1a",
                                                strokeWidth: 0.5,
                                                outline: "none",
                                                transition: "all 250ms"
                                            },
                                            hover: {
                                                fill: isVisited ? color : "#3a3a3a",
                                                stroke: "#1a1a1a",
                                                strokeWidth: 0.5,
                                                outline: "none",
                                                cursor: "pointer"
                                            },
                                            pressed: {
                                                fill: isVisited ? color : "#2a2a2a",
                                                outline: "none"
                                            }
                                        }}
                                    />
                                )
                            })
                        }
                    </Geographies>

                    {/* City Markers */}
                    {citiesWithCoords.map((visit) => (
                        <Marker key={visit.id} coordinates={[visit.lng!, visit.lat!]}>
                            <circle r={4} fill="#FFFFFF" stroke={color} strokeWidth={2} />
                            <circle
                                r={4}
                                fill={color}
                                opacity={0.4}
                                className="animate-ping"
                            />
                        </Marker>
                    ))}
                </ZoomableGroup>
            </ComposableMap>

            {tooltipContent && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-full text-sm pointer-events-none backdrop-blur-sm border border-white/10 z-50 whitespace-nowrap">
                    {tooltipContent}
                </div>
            )}
        </div>
    )
}

export default memo(WorldMap)
