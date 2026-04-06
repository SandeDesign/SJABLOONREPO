import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ArrowRight, MessageSquare } from 'lucide-react'
import { useTenantConfig } from '../../../hooks/useTenantConfig'
import { getCollection, where } from '../../../lib/firestore'
import PageHeader from './HeroSection'
import { Card, CardContent } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'

interface Review {
  id: string
  naam: string
  tekst: string
  rating: number
  rol?: string
  goedgekeurd: boolean
}

const ReviewsPage = () => {
  const { config } = useTenantConfig()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = `Reviews — ${config.info.naam}`
    getCollection<Review>('reviews', where('goedgekeurd', '==', true))
      .then(setReviews)
      .finally(() => setLoading(false))
  }, [config.info.naam])

  const gemiddeld =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null

  return (
    <>
      <PageHeader
        titel="Reviews"
        subtitel="Wat onze klanten over ons zeggen"
      />

      {/* Statistieken */}
      {gemiddeld && (
        <section className="py-12 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={28}
                  className={
                    i < Math.round(Number(gemiddeld))
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }
                />
              ))}
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{gemiddeld}</p>
            <p className="text-gray-500 dark:text-gray-400">
              Gebaseerd op {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>
        </section>
      )}

      {/* Reviews grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Laden...</div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            size={16}
                            className={
                              j < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 italic leading-relaxed">
                        &ldquo;{review.tekst}&rdquo;
                      </p>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {review.naam}
                        </p>
                        {review.rol && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{review.rol}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nog geen reviews
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Binnenkort verschijnen hier beoordelingen van onze klanten.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      {config.website.contact && (
        <section className="py-16 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Overtuigd?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Neem contact met ons op en ervaar het zelf.
            </p>
            <Link to="/contact">
              <Button size="lg" icon={<ArrowRight size={18} />}>
                Contact opnemen
              </Button>
            </Link>
          </div>
        </section>
      )}
    </>
  )
}

export default ReviewsPage
