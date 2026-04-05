import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { useContent } from '../../../hooks/useContent'

interface AboutContent {
  id?: string
  titel?: string
  tekst?: string
  afbeeldingUrl?: string
  kenmerken?: string[]
}

const AboutSection = () => {
  const { data, loading } = useContent<AboutContent>('about')

  if (loading || !data) {
    return (
      <section id="about" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
          >
            Over ons
          </h2>
          <p className="text-gray-500 dark:text-gray-400">Inhoud wordt geladen...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Tekst */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
              style={{ fontFamily: 'var(--font-heading, inherit)' }}
            >
              {data.titel || 'Over ons'}
            </h2>
            {data.tekst && (
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                {data.tekst}
              </p>
            )}
            {data.kenmerken && data.kenmerken.length > 0 && (
              <ul className="space-y-3">
                {data.kenmerken.map((kenmerk, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                    {kenmerk}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Afbeelding */}
          {data.afbeeldingUrl && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={data.afbeeldingUrl}
                alt={data.titel || 'Over ons'}
                className="rounded-2xl shadow-lg w-full object-cover"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

export default AboutSection
