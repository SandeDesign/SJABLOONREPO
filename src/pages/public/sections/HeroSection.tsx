import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTenantConfig } from '../../../hooks/useTenantConfig'
import { useContent } from '../../../hooks/useContent'
import Button from '../../../components/ui/Button'

interface HeroContent {
  id?: string
  titel?: string
  subtitel?: string
  ctaTekst?: string
  ctaLink?: string
  achtergrondUrl?: string
}

const HeroSection = () => {
  const { config } = useTenantConfig()
  const { data } = useContent<HeroContent>('hero')

  const titel = data?.titel || config.info.naam
  const subtitel = data?.subtitel || config.info.slogan
  const ctaTekst = data?.ctaTekst || 'Neem contact op'
  const ctaLink = data?.ctaLink || '#contact'

  return (
    <section
      id="hero"
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
    >
      {data?.achtergrondUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.achtergrondUrl})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {!data?.achtergrondUrl && (
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
        >
          <a href={ctaLink}>
            <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />}>
              {ctaTekst}
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
