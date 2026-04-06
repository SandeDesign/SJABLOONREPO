import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTenantConfig } from '../../../hooks/useTenantConfig'
import Button from '../../../components/ui/Button'

const PubliekeNavbar = () => {
  const { config } = useTenantConfig()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const paginas = [
    { key: 'hero', label: 'Home', href: '/' },
    { key: 'about', label: 'Over ons', href: '/over-ons' },
    { key: 'services', label: 'Diensten', href: '/diensten' },
    { key: 'portfolio', label: 'Portfolio', href: '/portfolio' },
    { key: 'reviews', label: 'Reviews', href: '/reviews' },
    { key: 'contact', label: 'Contact', href: '/contact' },
  ].filter((p) => config.website[p.key as keyof typeof config.website])

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            {config.branding.logoUrl && (
              <img
                src={config.branding.logoUrl}
                alt={config.info.naam}
                className="h-8 w-8 object-contain"
              />
            )}
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {config.info.naam}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {paginas.map((p) => (
              <Link
                key={p.key}
                to={p.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(p.href)
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                }`}
              >
                {p.label}
              </Link>
            ))}
            <Link to="/login" className="ml-4">
              <Button variant="primary" size="sm">
                Inloggen
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <div className="px-4 py-4 space-y-1">
              {paginas.map((p) => (
                <Link
                  key={p.key}
                  to={p.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive(p.href)
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  {p.label}
                </Link>
              ))}
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" isFullWidth className="mt-2">
                  Inloggen
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default PubliekeNavbar
