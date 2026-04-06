import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, Users, MessageSquare, Image } from 'lucide-react'
import { useTenantConfig } from '../../hooks/useTenantConfig'
import { useContent } from '../../hooks/useContent'
import Button from '../../components/ui/Button'
import { Card, CardContent } from '../../components/ui/Card'

interface HeroContent {
  id?: string
  titel?: string
  subtitel?: string
  ctaTekst?: string
  ctaLink?: string
  achtergrondUrl?: string
}

const PubliekeWebsite = () => {
  const { config } = useTenantConfig()
  const { data: hero } = useContent<HeroContent>('hero')

  useEffect(() => {
    document.title = config.seo.title || config.info.naam
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc && config.seo.description) {
      metaDesc.setAttribute('content', config.seo.description)
    }
  }, [config.seo.title, config.seo.description, config.info.naam])

  const titel = hero?.titel || config.info.naam
  const subtitel = hero?.subtitel || config.info.slogan
  const ctaTekst = hero?.ctaTekst || 'Neem contact op'

  const quickLinks = [
    {
      key: 'about',
      label: 'Over ons',
      beschrijving: 'Leer ons beter kennen en ontdek waar we voor staan',
      href: '/over-ons',
      icoon: Users,
    },
    {
      key: 'services',
      label: 'Diensten',
      beschrijving: 'Bekijk ons volledige aanbod aan diensten',
      href: '/diensten',
      icoon: Briefcase,
    },
    {
      key: 'portfolio',
      label: 'Portfolio',
      beschrijving: 'Bekijk ons werk en eerdere projecten',
      href: '/portfolio',
      icoon: Image,
    },
    {
      key: 'reviews',
      label: 'Reviews',
      beschrijving: 'Lees wat onze klanten over ons zeggen',
      href: '/reviews',
      icoon: MessageSquare,
    },
  ].filter((l) => config.website[l.key as keyof typeof config.website])

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {hero?.achtergrondUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${hero.achtergrondUrl})` }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800" />
        )}

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
          >
            {titel}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
          >
            {subtitel}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/contact">
              <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />}>
                {ctaTekst}
              </Button>
            </Link>
            {config.website.services && (
              <Link to="/diensten">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Bekijk onze diensten
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Snelkoppelingen naar pagina's */}
      {quickLinks.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-gray-950">
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
                Wat kunnen we voor u doen?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Ontdek meer over ons, onze diensten en wat we voor u kunnen betekenen.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickLinks.map((link, i) => (
                <motion.div
                  key={link.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={link.href}>
                    <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                      <CardContent className="pt-6 text-center">
                        <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4 mx-auto">
                          <link.icoon className="text-primary-600" size={26} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {link.label}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {link.beschrijving}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA sectie */}
      {config.website.contact && (
        <section className="py-20 bg-primary-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Klaar om te beginnen?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Neem vandaag nog contact met ons op. We helpen u graag verder.
              </p>
              <Link to="/contact">
                <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />}>
                  Contact opnemen
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </>
  )
}

export default PubliekeWebsite
