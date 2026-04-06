import { useEffect, useState } from 'react'
import { Plus, Edit3, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getCollection, addDocument, updateDocument, deleteDocument, Timestamp } from '../../../lib/firestore'
import ImageUpload from '../../../components/ui/ImageUpload'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { Card, CardContent } from '../../../components/ui/Card'

interface Product {
  id: string
  naam: string
  beschrijving: string
  prijs: string
  afbeeldingUrl?: string
  actief: boolean
}

const CmsProducten = () => {
  const [producten, setProducten] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Product | null>(null)
  const [nieuw, setNieuw] = useState(false)
  const [form, setForm] = useState({ naam: '', beschrijving: '', prijs: '', afbeeldingUrl: '', actief: true })
  const [saving, setSaving] = useState(false)

  const laden = async () => {
    const data = await getCollection<Product>('producten')
    setProducten(data)
    setLoading(false)
  }

  useEffect(() => {
    laden()
  }, [])

  const opslaan = async () => {
    setSaving(true)
    try {
      if (editing) {
        await updateDocument(`producten/${editing.id}`, form)
        toast.success('Product bijgewerkt')
      } else {
        await addDocument('producten', { ...form, createdAt: Timestamp.now() })
        toast.success('Product toegevoegd')
      }
      setEditing(null)
      setNieuw(false)
      setForm({ naam: '', beschrijving: '', prijs: '', afbeeldingUrl: '', actief: true })
      await laden()
    } catch {
      toast.error('Opslaan mislukt')
    } finally {
      setSaving(false)
    }
  }

  const toggleActief = async (product: Product) => {
    try {
      await updateDocument(`producten/${product.id}`, { actief: !product.actief })
      setProducten((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, actief: !p.actief } : p)),
      )
    } catch {
      toast.error('Bijwerken mislukt')
    }
  }

  const verwijderen = async (id: string) => {
    try {
      await deleteDocument(`producten/${id}`)
      setProducten((prev) => prev.filter((p) => p.id !== id))
      toast.success('Verwijderd')
    } catch {
      toast.error('Verwijderen mislukt')
    }
  }

  const bewerken = (product: Product) => {
    setEditing(product)
    setNieuw(false)
    setForm({
      naam: product.naam,
      beschrijving: product.beschrijving,
      prijs: product.prijs,
      afbeeldingUrl: product.afbeeldingUrl || '',
      actief: product.actief,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Producten</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Beheer producten en diensten.</p>
        </div>
        <Button
          icon={<Plus size={16} />}
          onClick={() => {
            setNieuw(true)
            setEditing(null)
            setForm({ naam: '', beschrijving: '', prijs: '', afbeeldingUrl: '', actief: true })
          }}
        >
          Toevoegen
        </Button>
      </div>

      {(nieuw || editing) && (
        <Card>
          <CardContent className="pt-4 space-y-4">
            <Input
              label="Naam"
              value={form.naam}
              onChange={(e) => setForm((f) => ({ ...f, naam: e.target.value }))}
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
            <Input
              label="Prijs"
              value={form.prijs}
              onChange={(e) => setForm((f) => ({ ...f, prijs: e.target.value }))}
            />
            <ImageUpload
              value={form.afbeeldingUrl}
              onChange={(url) => setForm((f) => ({ ...f, afbeeldingUrl: url }))}
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
      ) : producten.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Nog geen producten.</div>
      ) : (
        <div className="space-y-3">
          {producten.map((product) => (
            <Card key={product.id} className={!product.actief ? 'opacity-50' : ''}>
              <CardContent className="pt-4 flex items-center gap-4">
                {product.afbeeldingUrl && (
                  <img
                    src={product.afbeeldingUrl}
                    alt={product.naam}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{product.naam}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{product.prijs}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleActief(product)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.actief
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {product.actief ? 'Actief' : 'Inactief'}
                  </button>
                  <button
                    onClick={() => bewerken(product)}
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => verwijderen(product.id)}
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

export default CmsProducten
