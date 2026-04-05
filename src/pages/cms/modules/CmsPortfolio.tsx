import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit3 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getCollection, addDocument, updateDocument, deleteDocument, Timestamp } from '../../../lib/firestore'
import ImageUpload from '../../../components/ui/ImageUpload'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { Card, CardContent } from '../../../components/ui/Card'

interface PortfolioItem {
  id: string
  titel: string
  beschrijving: string
  afbeeldingUrl: string
  url?: string
  volgorde: number
}

const CmsPortfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<PortfolioItem | null>(null)
  const [nieuw, setNieuw] = useState(false)
  const [form, setForm] = useState({ titel: '', beschrijving: '', afbeeldingUrl: '', url: '' })
  const [saving, setSaving] = useState(false)

  const laden = async () => {
    const data = await getCollection<PortfolioItem>('portfolio')
    setItems(data.sort((a, b) => (a.volgorde || 0) - (b.volgorde || 0)))
    setLoading(false)
  }

  useEffect(() => {
    laden()
  }, [])

  const opslaan = async () => {
    setSaving(true)
    try {
      if (editing) {
        await updateDocument(`portfolio/${editing.id}`, form)
        toast.success('Portfolio item bijgewerkt')
      } else {
        await addDocument('portfolio', { ...form, volgorde: items.length, createdAt: Timestamp.now() })
        toast.success('Portfolio item toegevoegd')
      }
      setEditing(null)
      setNieuw(false)
      setForm({ titel: '', beschrijving: '', afbeeldingUrl: '', url: '' })
      await laden()
    } catch {
      toast.error('Opslaan mislukt')
    } finally {
      setSaving(false)
    }
  }

  const verwijderen = async (id: string) => {
    try {
      await deleteDocument(`portfolio/${id}`)
      setItems((prev) => prev.filter((i) => i.id !== id))
      toast.success('Verwijderd')
    } catch {
      toast.error('Verwijderen mislukt')
    }
  }

  const bewerken = (item: PortfolioItem) => {
    setEditing(item)
    setNieuw(false)
    setForm({
      titel: item.titel,
      beschrijving: item.beschrijving,
      afbeeldingUrl: item.afbeeldingUrl,
      url: item.url || '',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Beheer je portfolio items.</p>
        </div>
        <Button
          icon={<Plus size={16} />}
          onClick={() => {
            setNieuw(true)
            setEditing(null)
            setForm({ titel: '', beschrijving: '', afbeeldingUrl: '', url: '' })
          }}
        >
          Toevoegen
        </Button>
      </div>

      {(nieuw || editing) && (
        <Card>
          <CardContent className="pt-4 space-y-4">
            <Input
              label="Titel"
              value={form.titel}
              onChange={(e) => setForm((f) => ({ ...f, titel: e.target.value }))}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Beschrijving
              </label>
              <textarea
                rows={3}
                value={form.beschrijving}
                onChange={(e) => setForm((f) => ({ ...f, beschrijving: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>
            <ImageUpload
              path="portfolio"
              value={form.afbeeldingUrl}
              onChange={(url) => setForm((f) => ({ ...f, afbeeldingUrl: url }))}
            />
            <Input
              label="URL (optioneel)"
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            />
            <div className="flex gap-3">
              <Button onClick={opslaan} isLoading={saving}>
                Opslaan
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setNieuw(false)
                  setEditing(null)
                }}
              >
                Annuleren
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Laden...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Nog geen portfolio items.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-4 flex items-center gap-4">
                {item.afbeeldingUrl && (
                  <img
                    src={item.afbeeldingUrl}
                    alt={item.titel}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {item.titel}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {item.beschrijving}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => bewerken(item)}
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => verwijderen(item.id)}
                    className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default CmsPortfolio
