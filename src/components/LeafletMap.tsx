// components/LeafletMap.tsx
'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Visit } from '@/lib/types'

// Fix leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface LeafletMapProps {
    visitedCountries: string[]
    visits: Visit[]
    mapColor?: string
}

const getColorFromCSSVar = (colorVar: string): string => {
    const colors: Record<string, string> = {
        blue: '#93c5fd',
        green: '#86efac',
        purple: '#c4b5fd',
        pink: '#fbcfe8',
        orange: '#fdba74',
    }
    return colors[colorVar] || colors['blue']
}

const createCustomIcon = (color: string) => {
    const svgIcon = `
    <svg width="32" height="32" viewBox="0 0 24 24">
      <path fill="${color}" stroke="#000" stroke-width="0.5"
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 
      2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>`
    return L.divIcon({
        html: svgIcon,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    })
}

// 1️⃣ KEY: Use ADM0_A3 as the primary ISO code
const getCountryCode = (props: any) =>
    props.ADM0_A3 ||          // <—— LA BUENA
    props.ISO_A3 ||
    props.ISO3166_1_ALPHA_3 ||
    props.ISO ||
    null

const getCountryName = (props: any) =>
    props.ADMIN ||
    props.NAME ||
    props.SOVEREIGNT ||
    props.COUNTRY ||
    "Unknown"

export default function LeafletMap({ visitedCountries, visits, mapColor = 'blue' }: LeafletMapProps) {
    const [countriesGeoJSON, setCountriesGeoJSON] = useState<any>(null)
    const color = getColorFromCSSVar(mapColor)

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
            .then(res => res.json())
            .then(data => {
                console.log("🌍 GeoJSON cargado:", data.features?.length)
                setCountriesGeoJSON(data)
            })
            .catch(err => console.error('❌ Error cargando países:', err))
    }, [])

    const countryStyle = (feature: any) => {
        const props = feature.properties || {}

        const code = getCountryCode(props)
        const name = getCountryName(props)

        const isVisited = code && visitedCountries.includes(code)

        return {
            fillColor: isVisited ? color : 'rgba(255, 255, 255, 0.05)',
            fillOpacity: isVisited ? 0.6 : 0.1,
            color: isVisited ? color : 'rgba(255, 255, 255, 0.1)',
            weight: isVisited ? 2 : 0.5,
        }
    }

    return (
        <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
            zoomControl={true}
            attributionControl={false}
            minZoom={2}
            maxZoom={10}
        >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png" />

            {countriesGeoJSON && (
                <GeoJSON
                    data={countriesGeoJSON}
                    style={countryStyle}
                    onEachFeature={(feature, layer) => {
                        const props = feature.properties || {}
                        const code = getCountryCode(props)
                        const name = getCountryName(props)

                        if (code && visitedCountries.includes(code)) {
                            layer.bindTooltip(name)
                        }
                    }}
                />
            )}

            {visits.map((visit) => (
                <Marker
                    key={visit.id}
                    position={[visit.lat!, visit.lng!]}
                    icon={createCustomIcon(color)}
                >
                    <Popup>
                        <div className="text-sm">
                            <p className="font-bold">{visit.city_name}</p>
                            <p className="text-gray-400">{visit.country_name}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
