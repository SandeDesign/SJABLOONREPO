import { useState } from 'react'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTenantConfig } from '../../hooks/useTenantConfig'
import { setDocument } from '../../lib/firestore'
import { PresetName } from '../../config/tenant.config'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

const presets: { value: PresetName; label: string }[] = [
  { value: 'editorial', label: 'Editorial' },
  { value: 'brutalist', label: 'Brutalist' },
  { value: 'soft', label: 'Soft' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'artisan', label: 'Artisan' },
  { value: 'playful', label: 'Playful' },
]

const AdminInstellingen = () => {
  const { config } = useTenantConfig()
  const [saving, setSaving] = useState(false)

  const [modules, setModules] = useState(config.modules)
  const [website, setWebsite] = useState(config.website)
  const [branding, setBranding] = useState(config.branding)

  const opslaan = async () => {
    setSaving(true)
    try {
      await setDocument('config/tenant', { modules, website, branding })
      toast.success('Instellingen opgeslagen')
    } catch {
      toast.error('Opslaan mislukt')
    } finally {
      setSaving(false)
    }
  }

  const Toggle = ({
    label,
    checked,
    onChange,
  }: {
    label: string
    checked: boolean
    onChange: (v: boolean) => void
  }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  )

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Instellingen</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Beheer modules, website secties en branding.
        </p>
      </div>

      {/* Modules */}
      <Card>
        <CardHeader>
          <CardTitle>Modules</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-gray-200 dark:divide-gray-700">
          {(Object.keys(modules) as (keyof typeof modules)[]).map((key) => (
            <Toggle
              key={key}
              label={key}
              checked={modules[key]}
              onChange={(v) => setModules((prev) => ({ ...prev, [key]: v }))}
            />
          ))}
        </CardContent>
      </Card>

      {/* Website secties */}
      <Card>
        <CardHeader>
          <CardTitle>Website secties</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-gray-200 dark:divide-gray-700">
          {(Object.keys(website) as (keyof typeof website)[]).map((key) => (
            <Toggle
              key={key}
              label={key}
              checked={website[key]}
              onChange={(v) => setWebsite((prev) => ({ ...prev, [key]: v }))}
            />
          ))}
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Primaire kleur
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={branding.primaryColor}
                onChange={(e) => setBranding((b) => ({ ...b, primaryColor: e.target.value }))}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-500">{branding.primaryColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Accent kleur
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={branding.accentColor}
                onChange={(e) => setBranding((b) => ({ ...b, accentColor: e.target.value }))}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-500">{branding.accentColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preset thema
            </label>
            <select
              value={branding.preset}
              onChange={(e) =>
                setBranding((b) => ({ ...b, preset: e.target.value as PresetName }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {presets.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Button onClick={opslaan} isLoading={saving} icon={<Save size={16} />} size="lg">
        Alle instellingen opslaan
      </Button>
    </div>
  )
}

export default AdminInstellingen
