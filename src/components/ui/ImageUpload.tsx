import { useState, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  className?: string
  maxSizeKb?: number
}

function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context niet beschikbaar'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/webp', quality))
      }
      img.onerror = () => reject(new Error('Afbeelding laden mislukt'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Bestand lezen mislukt'))
    reader.readAsDataURL(file)
  })
}

const ImageUpload = ({ value, onChange, className, maxSizeKb = 800 }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const base64 = await compressImage(file)

      const sizeKb = Math.round((base64.length * 3) / 4 / 1024)
      if (sizeKb > maxSizeKb) {
        setError(`Afbeelding te groot (${sizeKb}KB). Maximaal ${maxSizeKb}KB.`)
        return
      }

      onChange(base64)
    } catch {
      setError('Afbeelding verwerken mislukt')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="Upload" className="w-full max-w-xs rounded-lg object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 transition-colors text-gray-500 dark:text-gray-400"
        >
          {uploading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Upload size={18} />
          )}
          {uploading ? 'Verwerken...' : 'Afbeelding kiezen'}
        </button>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  )
}

export default ImageUpload
