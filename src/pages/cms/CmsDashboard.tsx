import { motion } from 'framer-motion'
import {
  Calendar,
  MessageSquare,
  Image,
  Package,
  FileBox,
  Star,
  FileText,
  Settings,
  ExternalLink,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTenantConfig } from '../../hooks/useTenantConfig'
import ModuleCard from '../../components/ui/ModuleCard'
import Button from '../../components/ui/Button'

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
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {begroeting}, {user?.displayName || 'gebruiker'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welkom bij het beheerpaneel van {config.info.naam}.
          </p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" icon={<ExternalLink size={14} />}>
            Website bekijken
          </Button>
        </a>
      </motion.div>

      {/* Snelle acties */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/cms/paginas">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-5 rounded-xl border-2 border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
                <FileText size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Website teksten</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pas teksten en afbeeldingen aan</p>
              </div>
            </div>
          </motion.div>
        </Link>
        <Link to="/cms/instellingen">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Settings size={18} className="text-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Instellingen</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bedrijfsgegevens en account</p>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Module cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  )
}

export default CmsDashboard
