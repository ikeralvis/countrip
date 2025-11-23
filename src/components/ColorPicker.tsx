// components/ColorPicker.tsx
'use client'

import { Check } from 'lucide-react'

export type MapColor = 'blue' | 'green' | 'purple' | 'pink' | 'orange'

interface ColorOption {
    id: MapColor
    name: string
    cssVar: string
    preview: string
}

const COLOR_OPTIONS: ColorOption[] = [
    { id: 'blue', name: 'Azul', cssVar: '--color-blue', preview: 'rgb(147 197 253)' },
    { id: 'green', name: 'Verde', cssVar: '--color-green', preview: 'rgb(134 239 172)' },
    { id: 'purple', name: 'Púrpura', cssVar: '--color-purple', preview: 'rgb(196 181 253)' },
    { id: 'pink', name: 'Rosa', cssVar: '--color-pink', preview: 'rgb(251 207 232)' },
    { id: 'orange', name: 'Naranja', cssVar: '--color-orange', preview: 'rgb(253 186 116)' },
]

interface ColorPickerProps {
    selectedColor: MapColor
    onChange: (color: MapColor) => void
}

export default function ColorPicker({ selectedColor, onChange }: ColorPickerProps) {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
                Color del mapa
            </label>
            <div className="grid grid-cols-5 gap-2">
                {COLOR_OPTIONS.map((color) => (
                    <button
                        key={color.id}
                        onClick={() => onChange(color.id)}
                        className={`relative aspect-square rounded-lg transition-all ${selectedColor === color.id
                                ? 'ring-2 ring-white'
                                : 'hover:opacity-80'
                            }`}
                        style={{
                            backgroundColor: color.preview,
                        }}
                        title={color.name}
                    >
                        {selectedColor === color.id && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Check size={16} className="text-black" strokeWidth={3} />
                            </div>
                        )}
                    </button>
                ))}
            </div>
            <p className="text-xs text-gray-500">
                Los países visitados se pintarán con este color
            </p>
        </div>
    )
}
