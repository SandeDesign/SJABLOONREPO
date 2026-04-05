import { useEffect, useState, useRef } from 'react'
import { Upload, Download, Trash2, FileText, Loader2 } from 'lucide-react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../../../lib/firebase'
import toast from 'react-hot-toast'
import { getCollection, addDocument, deleteDocument, Timestamp } from '../../../lib/firestore'
import Button from '../../../components/ui/Button'
import { Card, CardContent } from '../../../components/ui/Card'

interface Document {
  id: string
  naam: string
  url: string
  categorie: 'offerte' | 'factuur' | 'contract' | 'overig'
  bestandsnaam: string
  createdAt: { seconds: number }
}

const categorieLabels: Record<string, string> = {
  offerte: 'Offerte',
  factuur: 'Factuur',
  contract: 'Contract',
  overig: 'Overig',
}

const CmsDocumenten = () => {
  const [documenten, setDocumenten] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [categorie, setCategorie] = useState<Document['categorie']>('overig')
  const inputRef = useRef<HTMLInputElement>(null)

  const laden = async () => {
    const data = await getCollection<Document>('documenten')
    setDocumenten(data)
    setLoading(false)
  }

  useEffect(() => {
    laden()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const storageRef = ref(storage, `documenten/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      await addDocument('documenten', {
        naam: file.name.replace(/\.[^/.]+$/, ''),
        bestandsnaam: file.name,
        url,
        categorie,
        createdAt: Timestamp.now(),
      })
      toast.success('Document geupload')
      await laden()
    } catch {
      toast.error('Upload mislukt')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
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
        <p className="text-gray-500 dark:text-gray-400 mt-1">Upload en beheer documenten.</p>
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
                onChange={(e) => setCategorie(e.target.value as Document['categorie'])}
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
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                  >
                    <Download size={16} />
                  </a>
                  <button
                    onClick={() => verwijderen(doc.id)}
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

export default CmsDocumenten
