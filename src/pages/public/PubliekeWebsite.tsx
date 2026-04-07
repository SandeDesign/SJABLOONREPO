import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, Users, MessageSquare, Image } from 'lucide-react'
import { useTenantConfig } from '../../hooks/useTenantConfig'
import { useContent } from '../../hooks/useContent'
import Button from '../../components/ui/Button'
import { Card, CardContent } from '../../components/ui/Card'

interface HomeContent {
  id?: string
  // Hero
  heroTitel?: string
  heroSubtitel?: string
  heroCtaTekst?: string
  heroCtaLink?: string
  heroAchtergrondUrl?: string
  heroCta2Tekst?: string
  // Secties overzicht
  sectieTitel?: string
  sectieSub?: string
  // Quick links
  aboutLabel?: string
  aboutBeschrijving?: string
  servicesLabel?: string
  servicesBeschrijving?: string
  portfolioLabel?: string
  portfolioBeschrijving?: string
  reviewsLabel?: string
  reviewsBeschrijving?: string
  // CTA
  ctaTitel?: string
  ctaTekst?: string
  ctaKnop?: string
}

const PubliekeWebsite = () => {
  const { config } = useTenantConfig()
  const { data: c, loading } = useContent<HomeContent>('home')

  useEffect(() => {
    document.title = config.seo.title || config.info.naam
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc && config.seo.description) {
      metaDesc.setAttribute('content', config.seo.description)
    }
  }, [config.seo.title, config.seo.description, config.info.naam])

  const heroTitel = c?.heroTitel || config.info.naam
  const heroSubtitel = c?.heroSubtitel || config.info.slogan
  const heroCtaTekst = c?.heroCtaTekst || 'Neem contact op'
  const heroCta2Tekst = c?.heroCta2Tekst || 'Bekijk onze diensten'

  const quickLinks = [
    {
      key: 'about',
      label: c?.aboutLabel || 'Over ons',
      beschrijving: c?.aboutBeschrijving || 'Leer ons beter kennen en ontdek waar we voor staan',
      href: '/over-ons',
      icoon: Users,
    },
    {
      key: 'services',
      label: c?.servicesLabel || 'Diensten',
      beschrijving: c?.servicesBeschrijving || 'Bekijk ons volledige aanbod aan diensten',
      href: '/diensten',
      icoon: Briefcase,
    },
    {
      key: 'portfolio',
      label: c?.portfolioLabel || 'Portfolio',
      beschrijving: c?.portfolioBeschrijving || 'Bekijk ons werk en eerdere projecten',
      href: '/portfolio',
      icoon: Image,
    },
    {
      key: 'reviews',
      label: c?.reviewsLabel || 'Reviews',
      beschrijving: c?.reviewsBeschrijving || 'Lees wat onze klanten over ons zeggen',
      href: '/reviews',
      icoon: MessageSquare,
    },
  ].filter((l) => config.website[l.key as keyof typeof config.website])

  return (
    <div className={`transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {c?.heroAchtergrondUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${c.heroAchtergrondUrl})` }}
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
            {heroTitel}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
          >
            {heroSubtitel}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to={c?.heroCtaLink || '/contact'}>
              <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />}>
                {heroCtaTekst}
              </Button>
            </Link>
            {config.website.services && (
              <Link to="/diensten">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  {heroCta2Tekst}
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Snelkoppelingen */}
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
                {c?.sectieTitel || 'Wat kunnen we voor u doen?'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {c?.sectieSub || 'Ontdek meer over ons, onze diensten en wat we voor u kunnen betekenen.'}
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

      {/* CTA */}
      {config.website.contact && (
        <section className="py-20 bg-primary-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {c?.ctaTitel || 'Klaar om te beginnen?'}
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                {c?.ctaTekst || 'Neem vandaag nog contact met ons op. We helpen u graag verder.'}
              </p>
              <Link to="/contact">
                <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />}>
                  {c?.ctaKnop || 'Contact opnemen'}
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}

export default PubliekeWebsite
