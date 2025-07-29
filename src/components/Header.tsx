'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/resorts', label: 'Resorts' },
    { href: '/fishing', label: 'Fishing' },
    { href: '/dnr', label: 'DNR Info' },
    { href: '/news', label: 'News & Events' },
    { href: '/area-services', label: 'Area Services' },
    { href: '/association', label: 'Association' },
  ]

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-2xl font-bold hover:text-accent transition-colors">
              Potato Lake Association
            </Link>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-accent text-primary'
                    : 'text-white hover:bg-accent hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
} 