// components/Navbar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Map, List, Settings } from 'lucide-react'

export default function Navbar() {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-[rgb(var(--border))] z-50">
            <div className="flex items-center justify-around h-14 max-w-md mx-auto px-4">
                <Link
                    href="/"
                    className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 transition-colors ${isActive('/')
                            ? 'text-white'
                            : 'text-gray-600 hover:text-gray-400'
                        }`}
                >
                    <Map size={20} strokeWidth={2} />
                    <span className="text-[10px] font-medium">Mapa</span>
                </Link>

                <Link
                    href="/trips"
                    className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 transition-colors ${isActive('/trips')
                            ? 'text-white'
                            : 'text-gray-600 hover:text-gray-400'
                        }`}
                >
                    <List size={20} strokeWidth={2} />
                    <span className="text-[10px] font-medium">Viajes</span>
                </Link>

                <Link
                    href="/settings"
                    className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 transition-colors ${isActive('/settings')
                            ? 'text-white'
                            : 'text-gray-600 hover:text-gray-400'
                        }`}
                >
                    <Settings size={20} strokeWidth={2} />
                    <span className="text-[10px] font-medium">Ajustes</span>
                </Link>
            </div>
        </nav>
    )
}