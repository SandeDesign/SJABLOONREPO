import { Link } from 'react-router-dom'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from './Card'

interface ModuleCardProps {
  titel: string
  beschrijving: string
  icoon: LucideIcon
  href: string
  actief?: boolean
}

const ModuleCard = ({ titel, beschrijving, icoon: Icon, href, actief = true }: ModuleCardProps) => {
  if (!actief) return null

  return (
    <Link to={href}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="pt-6">
          <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
            <Icon className="text-primary-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{titel}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{beschrijving}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default ModuleCard
