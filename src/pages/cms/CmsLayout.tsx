import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  Settings,
  Calendar,
  MessageSquare,
  Image,
  Package,
  FileBox,
  Star,
  Menu,
  X,
  LogOut,
  Shield,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTenantConfig } from '../../hooks/useTenantConfig'

interface CmsLayoutProps {
  isAdmin?: boolean
}

const CmsLayout = ({ isAdmin = false }: CmsLayoutProps) => {
  const { user, logout } = useAuth()
  const { config } = useTenantConfig()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const basePath = isAdmin ? '/admin' : '/cms'

  const cmsNavItems = [
    { path: `${basePath}/dashboard`, label: 'Dashboard', icon: LayoutDashboard, always: true },
    ...(isAdmin
      ? [
          { path: '/admin/instellingen', label: 'Instellingen', icon: Settings, always: true },
          { path: '/admin/gebruikers', label: 'Gebruikers', icon: Shield, always: true },
        ]
      : [
          { path: '/cms/paginas', label: "Pagina's", icon: FileText, always: true },
          { path: '/cms/afspraken', label: 'Afspraken', icon: Calendar, always: false, module: 'afspraken' as const },
          { path: '/cms/aanvragen', label: 'Aanvragen', icon: MessageSquare, always: false, module: 'aanvragen' as const },
          { path: '/cms/portfolio', label: 'Portfolio', icon: Image, always: false, module: 'portfolio' as const },
          { path: '/cms/producten', label: 'Producten', icon: Package, always: false, module: 'producten' as const },
          { path: '/cms/documenten', label: 'Documenten', icon: FileBox, always: false, module: 'documenten' as const },
          { path: '/cms/reviews', label: 'Reviews', icon: Star, always: false, module: 'reviews' as const },
          { path: '/cms/instellingen', label: 'Instellingen', icon: Settings, always: true },
        ]),
  ].filter((item) => {
    if (item.always) return true
    if ('module' in item && item.module) {
      return config.modules[item.module]
    }
    return true
  })

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 h-16 border-b border-gray-200 dark:border-gray-700">
          {config.branding.logoUrl && (
            <img src={config.branding.logoUrl} alt="" className="h-8 w-8 object-contain" />
          )}
          <span className="font-bold text-gray-900 dark:text-white truncate">
            {isAdmin ? 'Admin' : 'CMS'}
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {cmsNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}

          {/* Admin link for klant users */}
          {!isAdmin && user?.role === 'admin' && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
            >
              <Shield size={18} />
              Admin portaal
            </Link>
          )}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 truncate">
            {user?.displayName || user?.email}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut size={18} />
            Uitloggen
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300"
        >
          <Menu size={20} />
        </button>
        <span className="font-bold text-gray-900 dark:text-white">
          {isAdmin ? 'Admin' : 'CMS'}
        </span>
        <div className="w-9" />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-gray-800 z-50 lg:hidden"
            >
              <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-gray-700">
                <span className="font-bold text-gray-900 dark:text-white">
                  {isAdmin ? 'Admin' : 'CMS'}
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="px-3 py-4 space-y-1">
                {cmsNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive(item.path)
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                    )}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 px-3 py-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-600"
                >
                  <LogOut size={18} />
                  Uitloggen
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default CmsLayout
