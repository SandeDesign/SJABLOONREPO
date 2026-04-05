import { useEffect, useState } from 'react'
import { Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import { getCollection, updateDocument, orderBy } from '../../../lib/firestore'
import { Card, CardContent } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'

interface Aanvraag {
  id: string
  naam: string
  email: string
  telefoon?: string
  bericht: string
  status: 'nieuw' | 'in_behandeling' | 'afgerond' | 'afgewezen'
  createdAt: { seconds: number }
}

const statusKleuren: Record<string, string> = {
  nieuw: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  in_behandeling: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  afgerond: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  afgewezen: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

const statusLabels: Record<string, string> = {
  nieuw: 'Nieuw',
  in_behandeling: 'In behandeling',
  afgerond: 'Afgerond',
  afgewezen: 'Afgewezen',
}

const CmsAanvragen = () => {
  const [aanvragen, setAanvragen] = useState<Aanvraag[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('alle')

  useEffect(() => {
    getCollection<Aanvraag>('aanvragen', orderBy('createdAt', 'desc'))
      .then(setAanvragen)
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id: string, status: Aanvraag['status']) => {
    try {
      await updateDocument(`aanvragen/${id}`, { status })
      setAanvragen((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
      toast.success('Status bijgewerkt')
    } catch {
      toast.error('Status bijwerken mislukt')
    }
  }

  const gefilterd =
    filter === 'alle' ? aanvragen : aanvragen.filter((a) => a.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Aanvragen</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Bekijk en verwerk inkomende aanvragen.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="alle">Alle</option>
            <option value="nieuw">Nieuw</option>
            <option value="in_behandeling">In behandeling</option>
            <option value="afgerond">Afgerond</option>
            <option value="afgewezen">Afgewezen</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Laden...</div>
      ) : gefilterd.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Geen aanvragen gevonden.</div>
      ) : (
        <div className="space-y-4">
          {gefilterd.map((aanvraag) => (
            <Card key={aanvraag.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {aanvraag.naam}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusKleuren[aanvraag.status]}`}
                      >
                        {statusLabels[aanvraag.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {aanvraag.email}
                      {aanvraag.telefoon && ` | ${aanvraag.telefoon}`}
                    </p>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{aanvraag.bericht}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {aanvraag.status === 'nieuw' && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(aanvraag.id, 'in_behandeling')}
                      >
                        In behandeling
                      </Button>
                    )}
                    {(aanvraag.status === 'nieuw' || aanvraag.status === 'in_behandeling') && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => updateStatus(aanvraag.id, 'afgerond')}
                        >
                          Afronden
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(aanvraag.id, 'afgewezen')}
                        >
                          Afwijzen
                        </Button>
                      </>
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

export default CmsAanvragen
