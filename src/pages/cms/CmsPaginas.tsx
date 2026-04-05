import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTenantConfig } from '../../hooks/useTenantConfig'
import { getDocument, setDocument } from '../../lib/firestore'
import RichTextEditor from '../../components/ui/RichTextEditor'
import ImageUpload from '../../components/ui/ImageUpload'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

interface SectionData {
  [key: string]: unknown
}

const sections = [
  { key: 'hero', label: 'Hero sectie', fields: ['titel', 'subtitel', 'ctaTekst', 'ctaLink'] },
  { key: 'about', label: 'Over ons', fields: ['titel', 'tekst'], hasImage: true, hasKenmerken: true },
  { key: 'services', label: 'Diensten', fields: ['titel'], hasItems: true },
]

const CmsPaginas = () => {
  const { config } = useTenantConfig()
  const [editing, setEditing] = useState<string | null>(null)
  const [data, setData] = useState<SectionData>({})
  const [saving, setSaving] = useState(false)

  const activeSections = sections.filter(
    (s) => config.website[s.key as keyof typeof config.website],
  )

  const loadSection = async (key: string) => {
    const doc = await getDocument<SectionData>(`content/${key}`)
    if (doc) {
      setData(doc)
    } else {
      setData({})
    }
    setEditing(key)
  }

  const saveSection = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const { id, ...saveData } = data
      await setDocument(`content/${editing}`, saveData)
      toast.success('Opgeslagen!')
      setEditing(null)
    } catch {
      toast.error('Opslaan mislukt')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: string, value: unknown) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pagina&#39;s bewerken</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Bewerk de inhoud van je website secties.
        </p>
      </div>

      {!editing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeSections.map((section) => (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{section.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    icon={<Edit3 size={16} />}
                    onClick={() => loadSection(section.key)}
                  >
                    Bewerken
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {activeSections.find((s) => s.key === editing)?.label} bewerken
            </CardTitle>
            <button
              onClick={() => setEditing(null)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={20} />
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeSections
              .find((s) => s.key === editing)
              ?.fields.map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                    {field}
                  </label>
                  {field === 'tekst' ? (
                    <RichTextEditor
                      value={(data[field] as string) || ''}
                      onChange={(val) => updateField(field, val)}
                    />
                  ) : (
                    <input
                      type="text"
                      value={(data[field] as string) || ''}
                      onChange={(e) => updateField(field, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  )}
                </div>
              ))}

            {activeSections.find((s) => s.key === editing)?.hasImage && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Afbeelding
                </label>
                <ImageUpload
                  path={`content/${editing}`}
                  value={(data.afbeeldingUrl as string) || ''}
                  onChange={(url) => updateField('afbeeldingUrl', url)}
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button onClick={saveSection} isLoading={saving} icon={<Save size={16} />}>
                Opslaan
              </Button>
              <Button variant="outline" onClick={() => setEditing(null)}>
                Annuleren
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default CmsPaginas
