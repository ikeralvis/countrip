// components/StatsCard.tsx
'use client'

import { TOTAL_COUNTRIES } from '@/lib/countries'

interface StatsCardProps {
    visitedCount: number
}

export default function StatsCard({ visitedCount }: StatsCardProps) {
    const percentage = Math.round((visitedCount / TOTAL_COUNTRIES) * 100)
    const circumference = 2 * Math.PI * 20 // for mobile
    const circumferenceLg = 2 * Math.PI * 28 // for desktop
    const strokeDashoffset = circumference - (percentage / 100) * circumference
    const strokeDashoffsetLg = circumferenceLg - (percentage / 100) * circumferenceLg

    return (
        <div className="bg-black border border-[rgb(var(--border))] rounded-xl px-3 py-2 md:px-6 md:py-4 pointer-events-auto">
            <div className="flex items-center gap-2 md:gap-4">
                {/* Progress Circle - Mobile */}
                <div className="relative w-12 h-12 md:hidden">
                    <svg className="transform -rotate-90 w-12 h-12">
                        <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="rgb(var(--border))"
                            strokeWidth="3"
                            fill="none"
                        />
                        <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="white"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium">{percentage}%</span>
                    </div>
                </div>

                {/* Progress Circle - Desktop */}
                <div className="relative w-16 h-16 hidden md:block">
                    <svg className="transform -rotate-90 w-16 h-16">
                        <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="rgb(var(--border))"
                            strokeWidth="4"
                            fill="none"
                        />
                        <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="white"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={circumferenceLg}
                            strokeDashoffset={strokeDashoffsetLg}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-medium">{percentage}%</span>
                    </div>
                </div>

                {/* Stats Text */}
                <div>
                    <p className="text-[10px] md:text-xs text-gray-500 mb-0.5 md:mb-1">Países visitados</p>
                    <p className="text-lg md:text-2xl font-semibold whitespace-nowrap">
                        <span className="text-white">{visitedCount}</span>
                        <span className="text-gray-600 text-sm md:text-lg ml-1">/ {TOTAL_COUNTRIES}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
