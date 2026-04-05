import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { getCollection, orderBy } from '../../../lib/firestore'
import { Card, CardContent } from '../../../components/ui/Card'

interface PortfolioItem {
  id: string
  titel: string
  beschrijving: string
  afbeeldingUrl: string
  url?: string
}

const PortfolioSection = () => {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCollection<PortfolioItem>('portfolio', orderBy('titel'))
      .then(setItems)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="portfolio" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
          >
            Portfolio
          </h2>
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-500">Laden...</div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  {item.afbeeldingUrl && (
                    <img
                      src={item.afbeeldingUrl}
                      alt={item.titel}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardContent className="pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {item.titel}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {item.beschrijving}
                    </p>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Bekijken <ExternalLink size={14} />
                      </a>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Portfolio items worden binnenkort toegevoegd.
          </p>
        )}
      </div>
    </section>
  )
}

export default PortfolioSection
