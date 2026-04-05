import { motion } from 'framer-motion'
import {
  Calendar,
  MessageSquare,
  Image,
  Package,
  FileBox,
  Star,
  FileText,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTenantConfig } from '../../hooks/useTenantConfig'
import ModuleCard from '../../components/ui/ModuleCard'

const CmsDashboard = () => {
  const { user } = useAuth()
  const { config } = useTenantConfig()

  const uur = new Date().getHours()
  const begroeting = uur < 12 ? 'Goedemorgen' : uur < 18 ? 'Goedemiddag' : 'Goedenavond'

  return (
    <div className="space-y-8">
      {/* Welkom */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {begroeting}, {user?.displayName || 'gebruiker'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Beheer je website en content vanuit dit dashboard.
        </p>
      </motion.div>

      {/* Module cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ModuleCard
          titel="Pagina's"
          beschrijving="Bewerk de inhoud van je website"
          icoon={FileText}
          href="/cms/paginas"
        />
        <ModuleCard
          titel="Afspraken"
          beschrijving="Beheer afspraken en planning"
          icoon={Calendar}
          href="/cms/afspraken"
          actief={config.modules.afspraken}
        />
        <ModuleCard
          titel="Aanvragen"
          beschrijving="Bekijk en verwerk aanvragen"
          icoon={MessageSquare}
          href="/cms/aanvragen"
          actief={config.modules.aanvragen}
        />
        <ModuleCard
          titel="Portfolio"
          beschrijving="Beheer je portfolio items"
          icoon={Image}
          href="/cms/portfolio"
          actief={config.modules.portfolio}
        />
        <ModuleCard
          titel="Producten"
          beschrijving="Beheer producten en diensten"
          icoon={Package}
          href="/cms/producten"
          actief={config.modules.producten}
        />
        <ModuleCard
          titel="Documenten"
          beschrijving="Upload en beheer documenten"
          icoon={FileBox}
          href="/cms/documenten"
          actief={config.modules.documenten}
        />
        <ModuleCard
          titel="Reviews"
          beschrijving="Beheer klantbeoordelingen"
          icoon={Star}
          href="/cms/reviews"
          actief={config.modules.reviews}
        />
      </div>
    </div>
  )
}

export default CmsDashboard
