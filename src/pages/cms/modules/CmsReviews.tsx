import { useEffect, useState } from 'react'
import { Star, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { getCollection, updateDocument } from '../../../lib/firestore'
import { Card, CardContent } from '../../../components/ui/Card'

interface Review {
  id: string
  naam: string
  tekst: string
  rating: number
  rol?: string
  goedgekeurd: boolean
}

const CmsReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCollection<Review>('reviews')
      .then(setReviews)
      .finally(() => setLoading(false))
  }, [])

  const updateGoedkeuring = async (id: string, goedgekeurd: boolean) => {
    try {
      await updateDocument(`reviews/${id}`, { goedgekeurd })
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, goedgekeurd } : r)))
      toast.success(goedgekeurd ? 'Review goedgekeurd' : 'Review afgewezen')
    } catch {
      toast.error('Bijwerken mislukt')
    }
  }

  const wachtend = reviews.filter((r) => !r.goedgekeurd)
  const goedgekeurd = reviews.filter((r) => r.goedgekeurd)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Beheer klantbeoordelingen. Alleen goedgekeurde reviews verschijnen op de website.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Laden...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Nog geen reviews.</div>
      ) : (
        <>
          {wachtend.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Wachtend op goedkeuring ({wachtend.length})
              </h2>
              <div className="space-y-3">
                {wachtend.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onGoedkeuren={() => updateGoedkeuring(review.id, true)}
                    onAfwijzen={() => updateGoedkeuring(review.id, false)}
                  />
                ))}
              </div>
            </div>
          )}

          {goedgekeurd.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Goedgekeurd ({goedgekeurd.length})
              </h2>
              <div className="space-y-3">
                {goedgekeurd.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onAfwijzen={() => updateGoedkeuring(review.id, false)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const ReviewCard = ({
  review,
  onGoedkeuren,
  onAfwijzen,
}: {
  review: Review
  onGoedkeuren?: () => void
  onAfwijzen?: () => void
}) => (
  <Card>
    <CardContent className="pt-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 dark:text-white">{review.naam}</span>
            {review.rol && (
              <span className="text-sm text-gray-500 dark:text-gray-400">| {review.rol}</span>
            )}
          </div>
          <div className="flex gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }
              />
            ))}
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">{review.tekst}</p>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {onGoedkeuren && (
            <button
              onClick={onGoedkeuren}
              className="p-2 rounded hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600"
              title="Goedkeuren"
            >
              <Check size={18} />
            </button>
          )}
          {onAfwijzen && (
            <button
              onClick={onAfwijzen}
              className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
              title="Afwijzen"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
)

export default CmsReviews
