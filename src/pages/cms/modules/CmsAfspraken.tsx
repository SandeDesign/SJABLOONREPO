import { useEffect, useState } from 'react'
import { Calendar, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { getCollection, updateDocument, orderBy } from '../../../lib/firestore'
import { Card, CardContent } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'

interface Afspraak {
  id: string
  naam: string
  email: string
  telefoon?: string
  datum: string
  tijd: string
  dienst: string
  status: 'nieuw' | 'bevestigd' | 'geannuleerd' | 'afgerond'
  notities?: string
}

const statusKleuren: Record<string, string> = {
  nieuw: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  bevestigd: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  geannuleerd: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  afgerond: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
}

const CmsAfspraken = () => {
  const [afspraken, setAfspraken] = useState<Afspraak[]>([])
  const [loading, setLoading] = useState(true)

  const laden = async () => {
    setLoading(true)
    const data = await getCollection<Afspraak>('afspraken', orderBy('datum', 'desc'))
    setAfspraken(data)
    setLoading(false)
  }

  useEffect(() => {
    laden()
  }, [])

  const updateStatus = async (id: string, status: Afspraak['status']) => {
    try {
      await updateDocument(`afspraken/${id}`, { status })
      setAfspraken((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
      toast.success('Status bijgewerkt')
    } catch {
      toast.error('Status bijwerken mislukt')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Afspraken</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Beheer afspraken en planning.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Laden...</div>
      ) : afspraken.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Nog geen afspraken.</div>
      ) : (
        <div className="space-y-4">
          {afspraken.map((afspraak) => (
            <Card key={afspraak.id}>
              <CardContent className="pt-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {afspraak.naam}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusKleuren[afspraak.status]}`}
                      >
                        {afspraak.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {afspraak.email}
                      {afspraak.telefoon && ` | ${afspraak.telefoon}`}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {afspraak.datum}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {afspraak.tijd}
                      </span>
                      <span>{afspraak.dienst}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {afspraak.status === 'nieuw' && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(afspraak.id, 'bevestigd')}
                      >
                        Bevestigen
                      </Button>
                    )}
                    {afspraak.status !== 'geannuleerd' && afspraak.status !== 'afgerond' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(afspraak.id, 'geannuleerd')}
                      >
                        Annuleren
                      </Button>
                    )}
                    {afspraak.status === 'bevestigd' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateStatus(afspraak.id, 'afgerond')}
                      >
                        Afronden
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default CmsAfspraken
