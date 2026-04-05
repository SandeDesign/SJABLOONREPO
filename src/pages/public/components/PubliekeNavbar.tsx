import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTenantConfig } from '../../../hooks/useTenantConfig'
import Button from '../../../components/ui/Button'

const PubliekeNavbar = () => {
  const { config } = useTenantConfig()
  const [mobileOpen, setMobileOpen] = useState(false)

  const sections = [
    { key: 'hero', label: 'Home', href: '#hero' },
    { key: 'about', label: 'Over ons', href: '#about' },
    { key: 'services', label: 'Diensten', href: '#services' },
    { key: 'portfolio', label: 'Portfolio', href: '#portfolio' },
    { key: 'reviews', label: 'Reviews', href: '#reviews' },
    { key: 'contact', label: 'Contact', href: '#contact' },
  ].filter((s) => config.website[s.key as keyof typeof config.website])

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
          <div className="hidden md:flex items-center gap-6">
            {sections.map((s) => (
              <a
                key={s.key}
                href={s.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                {s.label}
              </a>
            ))}
            <Link to="/login">
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
            <div className="px-4 py-4 space-y-2">
              {sections.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {s.label}
                </a>
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
