import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useTenantConfig } from '../../../hooks/useTenantConfig'
import { useContent } from '../../../hooks/useContent'

interface HomeContent {
  aboutLabel?: string
  servicesLabel?: string
  portfolioLabel?: string
  reviewsLabel?: string
  contactLabel?: string
}

const PubliekeFooter = () => {
  const { config } = useTenantConfig()
  const { data: c } = useContent<HomeContent>('home')
  const jaar = new Date().getFullYear()

  const paginas = [
    { key: 'about', label: c?.aboutLabel || 'Over ons', href: '/over-ons' },
    { key: 'services', label: c?.servicesLabel || 'Diensten', href: '/diensten' },
    { key: 'portfolio', label: c?.portfolioLabel || 'Portfolio', href: '/portfolio' },
    { key: 'reviews', label: c?.reviewsLabel || 'Reviews', href: '/reviews' },
    { key: 'contact', label: c?.contactLabel || 'Contact', href: '/contact' },
  ].filter((p) => config.website[p.key as keyof typeof config.website])

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {config.info.naam}
            </h3>
            {config.info.slogan && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">{config.info.slogan}</p>
            )}
            {config.info.kvk && (
              <p className="text-sm text-gray-500 dark:text-gray-500">KVK: {config.info.kvk}</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Pagina&#39;s</h3>
            <div className="space-y-2">
              {paginas.map((p) => (
                <Link
                  key={p.key}
                  to={p.href}
                  className="block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {p.label}
                </Link>
              ))}
              <Link
                to="/login"
                className="block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Inloggen
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Contact</h3>
            <div className="space-y-3">
              {config.info.email && (
                <a
                  href={`mailto:${config.info.email}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <Mail size={16} />
                  {config.info.email}
                </a>
              )}
              {config.info.telefoon && (
                <a
                  href={`tel:${config.info.telefoon}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <Phone size={16} />
                  {config.info.telefoon}
                </a>
              )}
              {config.info.adres && (
                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin size={16} />
                  {config.info.adres}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-500">
            &copy; {jaar} {config.info.naam}. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default PubliekeFooter
