import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Save, X, Plus, Trash2, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTenantConfig } from '../../hooks/useTenantConfig'
import { getDocument, setDocument } from '../../lib/firestore'
import RichTextEditor from '../../components/ui/RichTextEditor'
import ImageUpload from '../../components/ui/ImageUpload'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

// ============================================================
// Types
// ============================================================

interface ServiceItem {
  titel: string
  beschrijving: string
  prijs?: string
}

// ============================================================
// Pagina configuratie
// ============================================================

const paginaConfig = [
  { key: 'home', label: 'Homepage', beschrijving: 'Hero, secties overzicht en CTA', websiteKey: 'hero' as const },
  { key: 'about', label: 'Over ons', beschrijving: 'Bedrijfsverhaal, kenmerken en afbeelding', websiteKey: 'about' as const },
  { key: 'services', label: 'Diensten', beschrijving: 'Lijst van diensten met beschrijving en prijs', websiteKey: 'services' as const },
  { key: 'portfolio', label: 'Portfolio', beschrijving: 'Pagina-teksten voor het portfolio overzicht', websiteKey: 'portfolio' as const },
  { key: 'reviews', label: 'Reviews', beschrijving: 'Pagina-teksten voor de reviews pagina', websiteKey: 'reviews' as const },
  { key: 'contact', label: 'Contact', beschrijving: 'Contactpagina teksten en formulier labels', websiteKey: 'contact' as const },
]

// ============================================================
// Helpers
// ============================================================

const SectieLabel = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-6 mb-3 first:mt-0">
    {children}
  </h3>
)

const VeldInput = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) => (
  <Input
    label={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
  />
)

// ============================================================
// Hoofdcomponent
// ============================================================

const CmsPaginas = () => {
  const { config } = useTenantConfig()
  const [editing, setEditing] = useState<string | null>(null)
  const [data, setData] = useState<Record<string, unknown>>({})
  const [saving, setSaving] = useState(false)

  const activePaginas = paginaConfig.filter((p) => {
    if (p.key === 'home') return true
    return config.website[p.websiteKey]
  })

  const loadSection = async (key: string) => {
    const doc = await getDocument<Record<string, unknown>>(`content/${key}`)
    setData(doc || {})
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

  const update = (field: string, value: unknown) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const v = (field: string) => (data[field] as string) || ''

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pagina&#39;s bewerken</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Bewerk alle teksten en afbeeldingen op de website.
        </p>
      </div>

      {!editing ? (
        <div className="space-y-4">
          {activePaginas.map((pagina) => (
            <motion.div key={pagina.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="py-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{pagina.label}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{pagina.beschrijving}</p>
                  </div>
                  <Button variant="outline" size="sm" icon={<Edit3 size={14} />} onClick={() => loadSection(pagina.key)}>
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
            <CardTitle>{activePaginas.find((p) => p.key === editing)?.label} bewerken</CardTitle>
            <button onClick={() => setEditing(null)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
              <X size={20} />
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing === 'home' && <HomeEditor v={v} update={update} />}
            {editing === 'about' && <AboutEditor data={data} v={v} update={update} />}
            {editing === 'services' && <ServicesEditor data={data} v={v} update={update} />}
            {editing === 'portfolio' && <PortfolioEditor v={v} update={update} />}
            {editing === 'reviews' && <ReviewsEditor v={v} update={update} />}
            {editing === 'contact' && <ContactEditor v={v} update={update} />}

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button onClick={saveSection} isLoading={saving} icon={<Save size={16} />}>Opslaan</Button>
              <Button variant="outline" onClick={() => setEditing(null)}>Annuleren</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ============================================================
// Homepage Editor
// ============================================================

const HomeEditor = ({
  v,
  update,
}: {
  v: (f: string) => string
  update: (f: string, val: unknown) => void
}) => (
  <div className="space-y-4">
    <SectieLabel>Hero sectie</SectieLabel>
    <VeldInput label="Titel" value={v('heroTitel')} onChange={(val) => update('heroTitel', val)} placeholder="Welkom bij ons bedrijf" />
    <VeldInput label="Subtitel" value={v('heroSubtitel')} onChange={(val) => update('heroSubtitel', val)} placeholder="Korte beschrijving" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <VeldInput label="Knop tekst" value={v('heroCtaTekst')} onChange={(val) => update('heroCtaTekst', val)} placeholder="Neem contact op" />
      <VeldInput label="Knop link" value={v('heroCtaLink')} onChange={(val) => update('heroCtaLink', val)} placeholder="/contact" />
    </div>
    <VeldInput label="Tweede knop tekst" value={v('heroCta2Tekst')} onChange={(val) => update('heroCta2Tekst', val)} placeholder="Bekijk onze diensten" />
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Achtergrondafbeelding</label>
      <ImageUpload value={v('heroAchtergrondUrl')} onChange={(url) => update('heroAchtergrondUrl', url)} />
    </div>

    <SectieLabel>Secties overzicht</SectieLabel>
    <VeldInput label="Sectie titel" value={v('sectieTitel')} onChange={(val) => update('sectieTitel', val)} placeholder="Wat kunnen we voor u doen?" />
    <VeldInput label="Sectie beschrijving" value={v('sectieSub')} onChange={(val) => update('sectieSub', val)} placeholder="Ontdek meer over ons..." />

    <SectieLabel>Pagina labels (navigatie)</SectieLabel>
    <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2 mb-2">
      Deze namen verschijnen in het menu en de footer.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <VeldInput label="Over ons" value={v('aboutLabel')} onChange={(val) => update('aboutLabel', val)} placeholder="Over ons" />
      <VeldInput label="Over ons beschrijving" value={v('aboutBeschrijving')} onChange={(val) => update('aboutBeschrijving', val)} placeholder="Leer ons kennen..." />
      <VeldInput label="Diensten" value={v('servicesLabel')} onChange={(val) => update('servicesLabel', val)} placeholder="Diensten" />
      <VeldInput label="Diensten beschrijving" value={v('servicesBeschrijving')} onChange={(val) => update('servicesBeschrijving', val)} placeholder="Bekijk ons aanbod..." />
      <VeldInput label="Portfolio" value={v('portfolioLabel')} onChange={(val) => update('portfolioLabel', val)} placeholder="Portfolio" />
      <VeldInput label="Portfolio beschrijving" value={v('portfolioBeschrijving')} onChange={(val) => update('portfolioBeschrijving', val)} placeholder="Bekijk ons werk..." />
      <VeldInput label="Reviews" value={v('reviewsLabel')} onChange={(val) => update('reviewsLabel', val)} placeholder="Reviews" />
      <VeldInput label="Reviews beschrijving" value={v('reviewsBeschrijving')} onChange={(val) => update('reviewsBeschrijving', val)} placeholder="Wat klanten zeggen..." />
      <VeldInput label="Contact" value={v('contactLabel')} onChange={(val) => update('contactLabel', val)} placeholder="Contact" />
    </div>

    <SectieLabel>CTA sectie (onderaan homepage)</SectieLabel>
    <VeldInput label="Titel" value={v('ctaTitel')} onChange={(val) => update('ctaTitel', val)} placeholder="Klaar om te beginnen?" />
    <VeldInput label="Beschrijving" value={v('ctaTekst')} onChange={(val) => update('ctaTekst', val)} placeholder="Neem vandaag nog contact op..." />
    <VeldInput label="Knop tekst" value={v('ctaKnop')} onChange={(val) => update('ctaKnop', val)} placeholder="Contact opnemen" />
  </div>
)

// ============================================================
// Over ons Editor
// ============================================================

const AboutEditor = ({
  data,
  v,
  update,
}: {
  data: Record<string, unknown>
  v: (f: string) => string
  update: (f: string, val: unknown) => void
}) => {
  const kenmerken = (data.kenmerken as string[]) || []

  return (
    <div className="space-y-4">
      <SectieLabel>Pagina header</SectieLabel>
      <VeldInput label="Pagina titel" value={v('paginaTitel')} onChange={(val) => update('paginaTitel', val)} placeholder="Over ons" />
      <VeldInput label="Pagina subtitel" value={v('paginaSubtitel')} onChange={(val) => update('paginaSubtitel', val)} placeholder="Leer ons beter kennen..." />

      <SectieLabel>Inhoud</SectieLabel>
      <VeldInput label="Kop" value={v('titel')} onChange={(val) => update('titel', val)} placeholder="Ons verhaal" />
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tekst</label>
        <RichTextEditor value={v('tekst')} onChange={(val) => update('tekst', val)} placeholder="Vertel over uw bedrijf..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Afbeelding</label>
        <ImageUpload value={v('afbeeldingUrl')} onChange={(url) => update('afbeeldingUrl', url)} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kenmerken / USP&#39;s</label>
          <Button variant="outline" size="sm" icon={<Plus size={14} />} onClick={() => update('kenmerken', [...kenmerken, ''])}>Toevoegen</Button>
        </div>
        {kenmerken.length > 0 ? (
          <div className="space-y-2">
            {kenmerken.map((k, i) => (
              <div key={i} className="flex items-center gap-2">
                <GripVertical size={14} className="text-gray-300 flex-shrink-0" />
                <input type="text" value={k} onChange={(e) => { const u = [...kenmerken]; u[i] = e.target.value; update('kenmerken', u) }}
                  placeholder="Bijv. 10 jaar ervaring"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                <button onClick={() => update('kenmerken', kenmerken.filter((_, j) => j !== i))} className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-gray-400 italic">Nog geen kenmerken.</p>}
      </div>

      <SectieLabel>CTA knop</SectieLabel>
      <VeldInput label="Knop tekst" value={v('ctaKnop')} onChange={(val) => update('ctaKnop', val)} placeholder="Neem contact op" />
    </div>
  )
}

// ============================================================
// Diensten Editor
// ============================================================

const ServicesEditor = ({
  data,
  v,
  update,
}: {
  data: Record<string, unknown>
  v: (f: string) => string
  update: (f: string, val: unknown) => void
}) => {
  const items = (data.items as ServiceItem[]) || []

  return (
    <div className="space-y-4">
      <SectieLabel>Pagina header</SectieLabel>
      <VeldInput label="Pagina titel" value={v('paginaTitel')} onChange={(val) => update('paginaTitel', val)} placeholder="Onze diensten" />
      <VeldInput label="Pagina subtitel" value={v('paginaSubtitel')} onChange={(val) => update('paginaSubtitel', val)} placeholder="Ontdek wat we voor u kunnen betekenen" />

      <SectieLabel>Diensten</SectieLabel>
      <div className="flex justify-end">
        <Button variant="outline" size="sm" icon={<Plus size={14} />} onClick={() => update('items', [...items, { titel: '', beschrijving: '', prijs: '' }])}>
          Dienst toevoegen
        </Button>
      </div>
      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item, i) => (
            <Card key={i} className="bg-gray-50 dark:bg-gray-800/50">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-medium text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">Dienst {i + 1}</span>
                  <button onClick={() => update('items', items.filter((_, j) => j !== i))} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><Trash2 size={14} /></button>
                </div>
                <Input label="Titel" value={item.titel} onChange={(e) => { const u = [...items]; u[i] = { ...u[i], titel: e.target.value }; update('items', u) }} placeholder="Naam van de dienst" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Beschrijving</label>
                  <textarea rows={2} value={item.beschrijving} onChange={(e) => { const u = [...items]; u[i] = { ...u[i], beschrijving: e.target.value }; update('items', u) }}
                    placeholder="Korte beschrijving" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white resize-none" />
                </div>
                <Input label="Prijs (optioneel)" value={item.prijs || ''} onChange={(e) => { const u = [...items]; u[i] = { ...u[i], prijs: e.target.value }; update('items', u) }} placeholder="Vanaf €99" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-sm text-gray-400">Nog geen diensten.</p>
        </div>
      )}

      <SectieLabel>Lege-staat teksten</SectieLabel>
      <VeldInput label="Titel als er geen diensten zijn" value={v('leegTitel')} onChange={(val) => update('leegTitel', val)} placeholder="Diensten worden binnenkort toegevoegd" />
      <VeldInput label="Tekst als er geen diensten zijn" value={v('leegTekst')} onChange={(val) => update('leegTekst', val)} placeholder="Neem gerust alvast contact op..." />

      <SectieLabel>CTA sectie</SectieLabel>
      <VeldInput label="Titel" value={v('ctaTitel')} onChange={(val) => update('ctaTitel', val)} placeholder="Interesse in een van onze diensten?" />
      <VeldInput label="Beschrijving" value={v('ctaTekst')} onChange={(val) => update('ctaTekst', val)} placeholder="Neem vrijblijvend contact op..." />
      <VeldInput label="Knop tekst" value={v('ctaKnop')} onChange={(val) => update('ctaKnop', val)} placeholder="Contact opnemen" />
    </div>
  )
}

// ============================================================
// Portfolio Editor
// ============================================================

const PortfolioEditor = ({ v, update }: { v: (f: string) => string; update: (f: string, val: unknown) => void }) => (
  <div className="space-y-4">
    <SectieLabel>Pagina header</SectieLabel>
    <VeldInput label="Pagina titel" value={v('paginaTitel')} onChange={(val) => update('paginaTitel', val)} placeholder="Portfolio" />
    <VeldInput label="Pagina subtitel" value={v('paginaSubtitel')} onChange={(val) => update('paginaSubtitel', val)} placeholder="Bekijk ons werk en eerdere projecten" />

    <SectieLabel>Lege-staat teksten</SectieLabel>
    <VeldInput label="Titel als er geen items zijn" value={v('leegTitel')} onChange={(val) => update('leegTitel', val)} placeholder="Portfolio items worden binnenkort toegevoegd" />
    <VeldInput label="Tekst als er geen items zijn" value={v('leegTekst')} onChange={(val) => update('leegTekst', val)} placeholder="We zijn druk bezig..." />

    <SectieLabel>Overig</SectieLabel>
    <VeldInput label="'Bekijken' link tekst" value={v('bekijkenTekst')} onChange={(val) => update('bekijkenTekst', val)} placeholder="Bekijken" />
  </div>
)

// ============================================================
// Reviews Editor
// ============================================================

const ReviewsEditor = ({ v, update }: { v: (f: string) => string; update: (f: string, val: unknown) => void }) => (
  <div className="space-y-4">
    <SectieLabel>Pagina header</SectieLabel>
    <VeldInput label="Pagina titel" value={v('paginaTitel')} onChange={(val) => update('paginaTitel', val)} placeholder="Reviews" />
    <VeldInput label="Pagina subtitel" value={v('paginaSubtitel')} onChange={(val) => update('paginaSubtitel', val)} placeholder="Wat onze klanten over ons zeggen" />

    <SectieLabel>Statistieken</SectieLabel>
    <VeldInput label="Statistiek tekst" value={v('statsTekst')} onChange={(val) => update('statsTekst', val)} placeholder="Gebaseerd op X reviews" />

    <SectieLabel>Lege-staat teksten</SectieLabel>
    <VeldInput label="Titel als er geen reviews zijn" value={v('leegTitel')} onChange={(val) => update('leegTitel', val)} placeholder="Nog geen reviews" />
    <VeldInput label="Tekst als er geen reviews zijn" value={v('leegTekst')} onChange={(val) => update('leegTekst', val)} placeholder="Binnenkort verschijnen hier beoordelingen..." />

    <SectieLabel>CTA sectie</SectieLabel>
    <VeldInput label="Titel" value={v('ctaTitel')} onChange={(val) => update('ctaTitel', val)} placeholder="Overtuigd?" />
    <VeldInput label="Beschrijving" value={v('ctaTekst')} onChange={(val) => update('ctaTekst', val)} placeholder="Neem contact met ons op..." />
    <VeldInput label="Knop tekst" value={v('ctaKnop')} onChange={(val) => update('ctaKnop', val)} placeholder="Contact opnemen" />
  </div>
)

// ============================================================
// Contact Editor
// ============================================================

const ContactEditor = ({ v, update }: { v: (f: string) => string; update: (f: string, val: unknown) => void }) => (
  <div className="space-y-4">
    <SectieLabel>Pagina header</SectieLabel>
    <VeldInput label="Pagina titel" value={v('paginaTitel')} onChange={(val) => update('paginaTitel', val)} placeholder="Contact" />
    <VeldInput label="Pagina subtitel" value={v('paginaSubtitel')} onChange={(val) => update('paginaSubtitel', val)} placeholder="We horen graag van u..." />

    <SectieLabel>Kolom links</SectieLabel>
    <VeldInput label="Contactgegevens titel" value={v('infoTitel')} onChange={(val) => update('infoTitel', val)} placeholder="Contactgegevens" />
    <VeldInput label="Openingstijden titel" value={v('openingsTitel')} onChange={(val) => update('openingsTitel', val)} placeholder="Openingstijden" />

    <SectieLabel>Formulier</SectieLabel>
    <VeldInput label="Formulier titel" value={v('formulierTitel')} onChange={(val) => update('formulierTitel', val)} placeholder="Stuur een bericht" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <VeldInput label="Naam label" value={v('naamLabel')} onChange={(val) => update('naamLabel', val)} placeholder="Naam" />
      <VeldInput label="E-mail label" value={v('emailLabel')} onChange={(val) => update('emailLabel', val)} placeholder="E-mail" />
      <VeldInput label="Telefoon label" value={v('telefoonLabel')} onChange={(val) => update('telefoonLabel', val)} placeholder="Telefoon (optioneel)" />
      <VeldInput label="Bericht label" value={v('berichtLabel')} onChange={(val) => update('berichtLabel', val)} placeholder="Bericht" />
    </div>
    <VeldInput label="Bericht placeholder" value={v('berichtPlaceholder')} onChange={(val) => update('berichtPlaceholder', val)} placeholder="Waar kunnen we u mee helpen?" />
    <VeldInput label="Verzend knop tekst" value={v('verzendKnop')} onChange={(val) => update('verzendKnop', val)} placeholder="Versturen" />

    <SectieLabel>Bevestigingen</SectieLabel>
    <VeldInput label="Succes melding" value={v('successBericht')} onChange={(val) => update('successBericht', val)} placeholder="Bericht verzonden! We nemen zo snel mogelijk contact op." />
    <VeldInput label="Fout melding" value={v('errorBericht')} onChange={(val) => update('errorBericht', val)} placeholder="Er ging iets mis. Probeer het later opnieuw." />
  </div>
)

export default CmsPaginas
