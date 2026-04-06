import { useEffect, useState, useRef } from 'react'
import { Upload, Download, Trash2, FileText, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getCollection, addDocument, deleteDocument, Timestamp } from '../../../lib/firestore'
import Button from '../../../components/ui/Button'
import { Card, CardContent } from '../../../components/ui/Card'

interface DocumentItem {
  id: string
  naam: string
  data: string
  categorie: 'offerte' | 'factuur' | 'contract' | 'overig'
  bestandsnaam: string
  type: string
  createdAt: { seconds: number }
}

const categorieLabels: Record<string, string> = {
  offerte: 'Offerte',
  factuur: 'Factuur',
  contract: 'Contract',
  overig: 'Overig',
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Bestand lezen mislukt'))
    reader.readAsDataURL(file)
  })
}

const CmsDocumenten = () => {
  const [documenten, setDocumenten] = useState<DocumentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [categorie, setCategorie] = useState<DocumentItem['categorie']>('overig')
  const inputRef = useRef<HTMLInputElement>(null)

  const laden = async () => {
    const data = await getCollection<DocumentItem>('documenten')
    setDocumenten(data)
    setLoading(false)
  }

  useEffect(() => {
    laden()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 1024 * 1024) {
      toast.error('Bestand te groot. Maximaal 1MB.')
      return
    }

    setUploading(true)
    try {
      const base64 = await fileToBase64(file)
      await addDocument('documenten', {
        naam: file.name.replace(/\.[^/.]+$/, ''),
        bestandsnaam: file.name,
        data: base64,
        type: file.type,
        categorie,
        createdAt: Timestamp.now(),
      })
      toast.success('Document opgeslagen')
      await laden()
    } catch {
      toast.error('Upload mislukt')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const downloaden = (doc: DocumentItem) => {
    const link = document.createElement('a')
    link.href = doc.data
    link.download = doc.bestandsnaam
    link.click()
  }

  const verwijderen = async (id: string) => {
    try {
      await deleteDocument(`documenten/${id}`)
      setDocumenten((prev) => prev.filter((d) => d.id !== id))
      toast.success('Verwijderd')
    } catch {
      toast.error('Verwijderen mislukt')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Documenten</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Upload en beheer documenten (max 1MB per bestand).</p>
      </div>

      {/* Upload */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categorie
              </label>
              <select
                value={categorie}
                onChange={(e) => setCategorie(e.target.value as DocumentItem['categorie'])}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="offerte">Offerte</option>
                <option value="factuur">Factuur</option>
                <option value="contract">Contract</option>
                <option value="overig">Overig</option>
              </select>
            </div>
            <Button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              icon={uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            >
              {uploading ? 'Uploaden...' : 'Document uploaden'}
            </Button>
            <input
              ref={inputRef}
              type="file"
              onChange={handleUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lijst */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Laden...</div>
      ) : documenten.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Nog geen documenten.</div>
      ) : (
        <div className="space-y-3">
          {documenten.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="pt-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {doc.naam}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {categorieLabels[doc.categorie]}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => downloaden(doc)}
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                    title="Downloaden"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => verwijderen(doc.id)}
                    className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                    title="Verwijderen"
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

export default CmsDocumenten
