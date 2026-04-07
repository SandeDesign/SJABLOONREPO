import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { useTenantConfig } from '../../../hooks/useTenantConfig'
import { useContent } from '../../../hooks/useContent'
import PageHeader from './HeroSection'
import Button from '../../../components/ui/Button'

interface AboutContent {
  id?: string
  // Page header
  paginaTitel?: string
  paginaSubtitel?: string
  // Inhoud
  titel?: string
  tekst?: string
  afbeeldingUrl?: string
  kenmerken?: string[]
  // CTA
  ctaKnop?: string
}

const AboutPage = () => {
  const { config } = useTenantConfig()
  const { data: c, loading } = useContent<AboutContent>('about')

  useEffect(() => {
    document.title = `${c?.paginaTitel || 'Over ons'} — ${config.info.naam}`
  }, [config.info.naam, c?.paginaTitel])

  return (
    <div className={`transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
      <PageHeader
        titel={c?.paginaTitel || 'Over ons'}
        subtitel={c?.paginaSubtitel || 'Leer ons beter kennen en ontdek waar we voor staan'}
      />

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2
                  className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6"
                  style={{ fontFamily: 'var(--font-heading, inherit)' }}
                >
                  {c?.titel || config.info.naam}
                </h2>
                {c?.tekst ? (
                  <div
                    className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8 prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: c.tekst }}
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                    {config.info.slogan}
                  </p>
                )}

                {c?.kenmerken && c.kenmerken.length > 0 && (
                  <ul className="space-y-3 mb-8">
                    {c.kenmerken.map((kenmerk, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                      >
                        <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                        {kenmerk}
                      </motion.li>
                    ))}
                  </ul>
                )}

                {config.website.contact && (
                  <Link to="/contact">
                    <Button icon={<ArrowRight size={16} />}>
                      {c?.ctaKnop || 'Neem contact op'}
                    </Button>
                  </Link>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {c?.afbeeldingUrl ? (
                  <img
                    src={c.afbeeldingUrl}
                    alt={c?.titel || 'Over ons'}
                    className="rounded-2xl shadow-lg w-full object-cover"
                  />
                ) : (
                  <div className="rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 aspect-square flex items-center justify-center">
                    <span className="text-6xl font-bold text-primary-600/20">
                      {config.info.naam.charAt(0)}
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
