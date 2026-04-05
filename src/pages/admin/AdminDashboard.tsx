import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Settings, ToggleRight } from 'lucide-react'
import { useTenantConfig } from '../../hooks/useTenantConfig'
import { getCollection } from '../../lib/firestore'
import ModuleCard from '../../components/ui/ModuleCard'
import { Card, CardContent } from '../../components/ui/Card'

const AdminDashboard = () => {
  const { config } = useTenantConfig()
  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    getCollection('users').then((users) => setUserCount(users.length))
  }, [])

  const actieveModules = Object.entries(config.modules).filter(([, v]) => v).length
  const totalModules = Object.keys(config.modules).length

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Beheer de tenant configuratie en gebruikers.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="mx-auto text-primary-600 mb-2" size={28} />
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{userCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Gebruikers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <ToggleRight className="mx-auto text-green-600 mb-2" size={28} />
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {actieveModules}/{totalModules}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Actieve modules</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Settings className="mx-auto text-purple-600 mb-2" size={28} />
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {config.branding.preset}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Preset thema</p>
          </CardContent>
        </Card>
      </div>

      {/* Snelkoppelingen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ModuleCard
          titel="Instellingen"
          beschrijving="Modules, secties en branding beheren"
          icoon={Settings}
          href="/admin/instellingen"
        />
        <ModuleCard
          titel="Gebruikers"
          beschrijving="Gebruikers en rollen beheren"
          icoon={Users}
          href="/admin/gebruikers"
        />
      </div>
    </div>
  )
}

export default AdminDashboard
