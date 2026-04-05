import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { getCollection, where } from '../../../lib/firestore'
import { Card, CardContent } from '../../../components/ui/Card'

interface Review {
  id: string
  naam: string
  tekst: string
  rating: number
  rol?: string
  goedgekeurd: boolean
}

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCollection<Review>('reviews', where('goedgekeurd', '==', true))
      .then(setReviews)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="reviews" className="py-20 bg-gray-50 dark:bg-gray-950">
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
            Wat klanten zeggen
          </h2>
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-500">Laden...</div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
                    <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                      &ldquo;{review.tekst}&rdquo;
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{review.naam}</p>
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
          <p className="text-center text-gray-500 dark:text-gray-400">
            Nog geen reviews beschikbaar.
          </p>
        )}
      </div>
    </section>
  )
}

export default ReviewsSection
