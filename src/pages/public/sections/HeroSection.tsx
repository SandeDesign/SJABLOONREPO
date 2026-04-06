import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Button from '../../../components/ui/Button'

interface PageHeaderProps {
  titel: string
  subtitel?: string
  ctaTekst?: string
  ctaHref?: string
}

const PageHeader = ({ titel, subtitel, ctaTekst, ctaHref }: PageHeaderProps) => (
  <section className="relative py-20 md:py-28 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800" />
    <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl font-bold text-white mb-4"
        style={{ fontFamily: 'var(--font-heading, inherit)' }}
      >
        {titel}
      </motion.h1>
      {subtitel && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-white/80 max-w-2xl mx-auto mb-8"
        >
          {subtitel}
        </motion.p>
      )}
      {ctaTekst && ctaHref && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link to={ctaHref}>
            <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />}>
              {ctaTekst}
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  </section>
)

export default PageHeader
