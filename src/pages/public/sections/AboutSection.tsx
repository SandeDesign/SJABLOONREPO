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
  titel?: string
  tekst?: string
  afbeeldingUrl?: string
  kenmerken?: string[]
}

const AboutPage = () => {
  const { config } = useTenantConfig()
  const { data, loading } = useContent<AboutContent>('about')

  useEffect(() => {
    document.title = `Over ons — ${config.info.naam}`
  }, [config.info.naam])

  return (
    <>
      <PageHeader
        titel="Over ons"
        subtitel="Leer ons beter kennen en ontdek waar we voor staan"
      />

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Inhoud wordt geladen...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Tekst */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2
                  className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6"
                  style={{ fontFamily: 'var(--font-heading, inherit)' }}
                >
                  {data?.titel || config.info.naam}
                </h2>
                {data?.tekst ? (
                  <div
                    className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8 prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: data.tekst }}
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                    {config.info.slogan}
                  </p>
                )}

                {data?.kenmerken && data.kenmerken.length > 0 && (
                  <ul className="space-y-3 mb-8">
                    {data.kenmerken.map((kenmerk, i) => (
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
                    <Button icon={<ArrowRight size={16} />}>Neem contact op</Button>
                  </Link>
                )}
              </motion.div>

              {/* Afbeelding */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {data?.afbeeldingUrl ? (
                  <img
                    src={data.afbeeldingUrl}
                    alt={data?.titel || 'Over ons'}
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
          )}
        </div>
      </section>
    </>
  )
}

export default AboutPage
