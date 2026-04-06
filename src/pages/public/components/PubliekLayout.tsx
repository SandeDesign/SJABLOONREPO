import { Outlet } from 'react-router-dom'
import { useTenantConfig } from '../../../hooks/useTenantConfig'
import PubliekeNavbar from './PubliekeNavbar'
import PubliekeFooter from './PubliekeFooter'

const PubliekLayout = () => {
  const { config } = useTenantConfig()

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900" data-preset={config.branding.preset}>
      <PubliekeNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PubliekeFooter />
    </div>
  )
}

export default PubliekLayout
