import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, ArrowRight } from 'lucide-react'
import { useTenantConfig } from '../../../hooks/useTenantConfig'
import { useContent } from '../../../hooks/useContent'
import PageHeader from './HeroSection'
import { Card, CardContent } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'

interface ServiceItem {
  titel: string
  beschrijving: string
  prijs?: string
}

interface ServicesContent {
  id?: string
  paginaTitel?: string
  paginaSubtitel?: string
  titel?: string
  items?: ServiceItem[]
  leegTitel?: string
  leegTekst?: string
  ctaTitel?: string
  ctaTekst?: string
  ctaKnop?: string
}

const ServicesPage = () => {
  const { config } = useTenantConfig()
  const { data: c, loading } = useContent<ServicesContent>('services')
  const items = c?.items || []

  useEffect(() => {
    document.title = `${c?.paginaTitel || 'Diensten'} — ${config.info.naam}`
  }, [config.info.naam, c?.paginaTitel])

  return (
    <>
      <PageHeader
        titel={c?.paginaTitel || 'Onze diensten'}
        subtitel={c?.paginaSubtitel || 'Ontdek wat we voor u kunnen betekenen'}
        ctaTekst={config.website.contact ? (c?.ctaKnop || 'Offerte aanvragen') : undefined}
        ctaHref={config.website.contact ? '/contact' : undefined}
      />

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Laden...</div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-5">
                        <Briefcase className="text-primary-600" size={26} />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        {service.titel}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                        {service.beschrijving}
                      </p>
                      {service.prijs && (
                        <p className="text-xl font-bold text-primary-600">{service.prijs}</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {c?.leegTitel || 'Diensten worden binnenkort toegevoegd'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {c?.leegTekst || 'Neem gerust alvast contact met ons op voor meer informatie.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {config.website.contact && (
        <section className="py-16 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {c?.ctaTitel || 'Interesse in een van onze diensten?'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {c?.ctaTekst || 'Neem vrijblijvend contact met ons op voor een gesprek of offerte.'}
            </p>
            <Link to="/contact">
              <Button size="lg" icon={<ArrowRight size={18} />}>
                {c?.ctaKnop || 'Contact opnemen'}
              </Button>
            </Link>
          </div>
        </section>
      )}
    </>
  )
}

export default ServicesPage
