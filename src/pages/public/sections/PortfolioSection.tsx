import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Image } from 'lucide-react'
import { useTenantConfig } from '../../../hooks/useTenantConfig'
import { useContent } from '../../../hooks/useContent'
import { getCollection, orderBy } from '../../../lib/firestore'
import PageHeader from './HeroSection'
import { Card, CardContent } from '../../../components/ui/Card'

interface PortfolioItem {
  id: string
  titel: string
  beschrijving: string
  afbeeldingUrl: string
  url?: string
}

interface PortfolioContent {
  id?: string
  paginaTitel?: string
  paginaSubtitel?: string
  leegTitel?: string
  leegTekst?: string
  bekijkenTekst?: string
}

const PortfolioPage = () => {
  const { config } = useTenantConfig()
  const { data: c } = useContent<PortfolioContent>('portfolio')
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = `${c?.paginaTitel || 'Portfolio'} — ${config.info.naam}`
    getCollection<PortfolioItem>('portfolio', orderBy('titel'))
      .then(setItems)
      .finally(() => setLoading(false))
  }, [config.info.naam, c?.paginaTitel])

  return (
    <>
      <PageHeader
        titel={c?.paginaTitel || 'Portfolio'}
        subtitel={c?.paginaSubtitel || 'Bekijk ons werk en eerdere projecten'}
      />

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Laden...</div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                    {item.afbeeldingUrl ? (
                      <img
                        src={item.afbeeldingUrl}
                        alt={item.titel}
                        className="w-full h-56 object-cover"
                      />
                    ) : (
                      <div className="w-full h-56 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Image className="text-gray-300 dark:text-gray-600" size={48} />
                      </div>
                    )}
                    <CardContent className="pt-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {item.titel}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1">
                        {item.beschrijving}
                      </p>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          {c?.bekijkenTekst || 'Bekijken'} <ExternalLink size={14} />
                        </a>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Image className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {c?.leegTitel || 'Portfolio items worden binnenkort toegevoegd'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {c?.leegTekst || 'We zijn druk bezig met het opbouwen van ons portfolio.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default PortfolioPage
