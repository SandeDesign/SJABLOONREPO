import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import { useContent } from '../../../hooks/useContent'
import { Card, CardContent } from '../../../components/ui/Card'

interface ServiceItem {
  titel: string
  beschrijving: string
  prijs?: string
  icoon?: string
}

interface ServicesContent {
  id?: string
  titel?: string
  items?: ServiceItem[]
}

const ServicesSection = () => {
  const { data, loading } = useContent<ServicesContent>('services')

  if (loading) {
    return (
      <section id="services" className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
          >
            Onze diensten
          </h2>
        </div>
      </section>
    )
  }

  const items = data?.items || []

  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-950">
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
            {data?.titel || 'Onze diensten'}
          </h2>
        </motion.div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                      <Briefcase className="text-primary-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {service.titel}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {service.beschrijving}
                    </p>
                    {service.prijs && (
                      <p className="text-lg font-bold text-primary-600">{service.prijs}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Diensten worden binnenkort toegevoegd.
          </p>
        )}
      </div>
    </section>
  )
}

export default ServicesSection
