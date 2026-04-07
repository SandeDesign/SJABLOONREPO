import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Save, Plus, Trash2, GripVertical, Globe, ArrowLeft } from 'lucide-react'
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
  { key: 'home', label: 'Homepage', beschrijving: 'De hoofdpagina van je website', websiteKey: 'hero' as const },
  { key: 'about', label: 'Over ons', beschrijving: 'Informatie over je bedrijf', websiteKey: 'about' as const },
  { key: 'services', label: 'Diensten', beschrijving: 'Je aanbod en prijzen', websiteKey: 'services' as const },
  { key: 'portfolio', label: 'Portfolio', beschrijving: 'Je werk en projecten', websiteKey: 'portfolio' as const },
  { key: 'reviews', label: 'Reviews', beschrijving: 'Klantbeoordelingen', websiteKey: 'reviews' as const },
  { key: 'contact', label: 'Contact', beschrijving: 'Contactformulier en gegevens', websiteKey: 'contact' as const },
]

// ============================================================
// Helpers
// ============================================================

const Groep = ({ titel, children }: { titel: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 pt-6 first:pt-0">
      <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2">
        {titel}
      </span>
      <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
    </div>
    {children}
  </div>
)

const Veld = ({
  label,
  value,
  onChange,
  placeholder,
  hulptekst,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hulptekst?: string
}) => (
  <div>
    <Input
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
    {hulptekst && <p className="mt-1 text-xs text-gray-400">{hulptekst}</p>}
  </div>
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
      toast.success('Wijzigingen opgeslagen!')
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Website teksten</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Pas alle teksten en afbeeldingen op je website aan.
        </p>
      </div>

      {!editing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activePaginas.map((pagina, i) => (
            <motion.div key={pagina.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card
                className="hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all cursor-pointer h-full"
                onClick={() => loadSection(pagina.key)}
              >
                <CardContent className="py-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                        <Globe size={18} className="text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{pagina.label}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{pagina.beschrijving}</p>
                      </div>
                    </div>
                    <Edit3 size={16} className="text-gray-400 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setEditing(null)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Terug naar overzicht
          </button>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {activePaginas.find((p) => p.key === editing)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing === 'home' && <HomeEditor v={v} update={update} />}
              {editing === 'about' && <AboutEditor data={data} v={v} update={update} />}
              {editing === 'services' && <ServicesEditor data={data} v={v} update={update} />}
              {editing === 'portfolio' && <PortfolioEditor v={v} update={update} />}
              {editing === 'reviews' && <ReviewsEditor v={v} update={update} />}
              {editing === 'contact' && <ContactEditor v={v} update={update} />}

              <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button onClick={saveSection} isLoading={saving} icon={<Save size={16} />}>
                  Opslaan
                </Button>
                <Button variant="outline" onClick={() => setEditing(null)}>
                  Annuleren
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// ============================================================
// Homepage
// ============================================================

const HomeEditor = ({
  v,
  update,
}: {
  v: (f: string) => string
  update: (f: string, val: unknown) => void
}) => (
  <div className="space-y-4">
    <Groep titel="Banner bovenaan">
      <Veld label="Titel" value={v('heroTitel')} onChange={(val) => update('heroTitel', val)} placeholder="Welkom bij ons bedrijf" />
      <Veld label="Ondertitel" value={v('heroSubtitel')} onChange={(val) => update('heroSubtitel', val)} placeholder="Korte beschrijving van je bedrijf" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Veld label="Knop tekst" value={v('heroCtaTekst')} onChange={(val) => update('heroCtaTekst', val)} placeholder="Neem contact op" />
        <Veld label="Knop link" value={v('heroCtaLink')} onChange={(val) => update('heroCtaLink', val)} placeholder="/contact" hulptekst="Bijv. /contact of /diensten" />
      </div>
      <Veld label="Tweede knop tekst" value={v('heroCta2Tekst')} onChange={(val) => update('heroCta2Tekst', val)} placeholder="Bekijk onze diensten" />
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Achtergrondafbeelding</label>
        <ImageUpload value={v('heroAchtergrondUrl')} onChange={(url) => update('heroAchtergrondUrl', url)} />
      </div>
    </Groep>

    <Groep titel="Overzicht secties">
      <Veld label="Kop" value={v('sectieTitel')} onChange={(val) => update('sectieTitel', val)} placeholder="Wat kunnen we voor u doen?" />
      <Veld label="Beschrijving" value={v('sectieSub')} onChange={(val) => update('sectieSub', val)} placeholder="Ontdek meer over ons..." />
    </Groep>

    <Groep titel="Menu namen">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Deze namen verschijnen in het menu en de footer van je website.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Veld label="Over ons" value={v('aboutLabel')} onChange={(val) => update('aboutLabel', val)} placeholder="Over ons" />
        <Veld label="Beschrijving over ons" value={v('aboutBeschrijving')} onChange={(val) => update('aboutBeschrijving', val)} placeholder="Leer ons kennen..." />
        <Veld label="Diensten" value={v('servicesLabel')} onChange={(val) => update('servicesLabel', val)} placeholder="Diensten" />
        <Veld label="Beschrijving diensten" value={v('servicesBeschrijving')} onChange={(val) => update('servicesBeschrijving', val)} placeholder="Bekijk ons aanbod..." />
        <Veld label="Portfolio" value={v('portfolioLabel')} onChange={(val) => update('portfolioLabel', val)} placeholder="Portfolio" />
        <Veld label="Beschrijving portfolio" value={v('portfolioBeschrijving')} onChange={(val) => update('portfolioBeschrijving', val)} placeholder="Bekijk ons werk..." />
        <Veld label="Reviews" value={v('reviewsLabel')} onChange={(val) => update('reviewsLabel', val)} placeholder="Reviews" />
        <Veld label="Beschrijving reviews" value={v('reviewsBeschrijving')} onChange={(val) => update('reviewsBeschrijving', val)} placeholder="Wat klanten zeggen..." />
        <Veld label="Contact" value={v('contactLabel')} onChange={(val) => update('contactLabel', val)} placeholder="Contact" />
      </div>
    </Groep>

    <Groep titel="Actie-blok onderaan">
      <Veld label="Kop" value={v('ctaTitel')} onChange={(val) => update('ctaTitel', val)} placeholder="Klaar om te beginnen?" />
      <Veld label="Beschrijving" value={v('ctaTekst')} onChange={(val) => update('ctaTekst', val)} placeholder="Neem vandaag nog contact op..." />
      <Veld label="Knop tekst" value={v('ctaKnop')} onChange={(val) => update('ctaKnop', val)} placeholder="Contact opnemen" />
    </Groep>
  </div>
)

// ============================================================
// Over ons
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
      <Groep titel="Bovenaan de pagina">
        <Veld label="Pagina titel" value={v('paginaTitel')} onChange={(val) => update('paginaTitel', val)} placeholder="Over ons" />
        <Veld label="Korte beschrijving" value={v('paginaSubtitel')} onChange={(val) => update('paginaSubtitel', val)} placeholder="Leer ons beter kennen..." />
      </Groep>

      <Groep titel="Inhoud">
        <Veld label="Kop" value={v('titel')} onChange={(val) => update('titel', val)} placeholder="Ons verhaal" />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tekst</label>
          <RichTextEditor value={v('tekst')} onChange={(val) => update('tekst', val)} placeholder="Vertel over je bedrijf..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Afbeelding</label>
          <ImageUpload value={v('afbeeldingUrl')} onChange={(url) => update('afbeeldingUrl', url)} />
        </div>
      </Groep>

      <Groep titel="Sterke punten">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Korte opsomming van wat jullie onderscheidt. Verschijnt als lijst met vinkjes.
        </p>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" icon={<Plus size={14} />} onClick={() => update('kenmerken', [...kenmerken, ''])}>
            Punt toevoegen
          </Button>
        </div>
        {kenmerken.length > 0 ? (
          <div className="space-y-2">
            {kenmerken.map((k, i) => (
              <div key={i} className="flex items-center gap-2">
                <GripVertical size={14} className="text-gray-300 flex-shrink-0" />
                <input
                  type="text"
                  value={k}
                  onChange={(e) => { const u = [...kenmerken]; u[i] = e.target.value; update('kenmerken', u) }}
                  placeholder="Bijv. 10 jaar ervaring"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button onClick={() => update('kenmerken', kenmerken.filter((_, j) => j !== i))} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">Nog geen punten toegevoegd.</p>
        )}
      </Groep>

      <Groep titel="Knop onderaan">
        <Veld label="Knop tekst" value={v('ctaKnop')} onChange={(val) => update('ctaKnop', val)} placeholder="Neem contact op" />
      </Groep>
    </div>
  )
}

// ============================================================
// Diensten
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
      <Groep titel="Bovenaan de pagina">
        <Veld label="Pagina titel" value={v('paginaTitel')} onChange={(val) => update('paginaTitel', val)} placeholder="Onze diensten" />
        <Veld label="Korte beschrijving" value={v('paginaSubtitel')} onChange={(val) => update('paginaSubtitel', val)} placeholder="Ontdek wat we voor u kunnen betekenen" />
      </Groep>

      <Groep titel="Diensten">
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
                    <span className="text-xs font-medium text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
                      Dienst {i + 1}
                    </span>
                    <button onClick={() => update('items', items.filter((_, j) => j !== i))} className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <Input label="Naam" value={item.titel} onChange={(e) => { const u = [...items]; u[i] = { ...u[i], titel: e.target.value }; update('items', u) }} placeholder="Naam van de dienst" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Beschrijving</label>
                    <textarea
                      rows={2}
                      value={item.beschrijving}
                      onChange={(e) => { const u = [...items]; u[i] = { ...u[i], beschrijving: e.target.value }; update('items', u) }}
                      placeholder="Korte beschrijving van deze dienst"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <Input label="Prijs (optioneel)" value={item.prijs || ''} onChange={(e) => { const u = [...items]; u[i] = { ...u[i], prijs: e.target.value }; update('items', u) }} placeholder="Vanaf €99" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-gray-400">Nog geen diensten toegevoegd.</p>
            <p className="text-xs text-gray-400 mt-1">Klik op &quot;Dienst toevoegen&quot; om te beginnen.</p>
          </div>
        )}
      </Groep>

      <Groep titel="Wanneer er nog geen diensten zijn">
        <Veld label="Titel" value={v('leegTitel')} onChange={(val) => update('leegTitel', val)} placeholder="Diensten worden binnenkort toegevoegd" />
        <Veld label="Tekst" value={v('leegTekst')} onChange={(val) => update('leegTekst', val)} placeholder="Neem gerust alvast contact op..." />
      </Groep>

      <Groep titel="Actie-blok onderaan">
        <Veld label="Kop" value={v('ctaTitel')} onChange={(val) => update('ctaTitel', val)} placeholder="Interesse in een van onze diensten?" />
        <Veld label="Beschrijving" value={v('ctaTekst')} onChange={(val) => update('ctaTekst', val)} placeholder="Neem vrijblijvend contact op..." />
        <Veld label="Knop tekst" value={v('ctaKnop')} onChange={(val) => update('ctaKnop', val)} placeholder="Contact opnemen" />
      </Groep>
    </div>
  )
}

// ============================================================
// Portfolio
// ============================================================

const PortfolioEditor = ({ v, update }: { v: (f: string) => string; update: (f: string, val: unknown) => void }) => (
  <div className="space-y-4">
    <Groep titel="Bovenaan de pagina">
      <Veld label="Pagina titel" value={v('paginaTitel')} onChange={(val) => update('paginaTitel', val)} placeholder="Portfolio" />
      <Veld label="Korte beschrijving" value={v('paginaSubtitel')} onChange={(val) => update('paginaSubtitel', val)} placeholder="Bekijk ons werk en eerdere projecten" />
    </Groep>

    <Groep titel="Wanneer er nog geen items zijn">
      <Veld label="Titel" value={v('leegTitel')} onChange={(val) => update('leegTitel', val)} placeholder="Portfolio items worden binnenkort toegevoegd" />
      <Veld label="Tekst" value={v('leegTekst')} onChange={(val) => update('leegTekst', val)} placeholder="We zijn druk bezig..." />
    </Groep>

    <Groep titel="Overig">
      <Veld label="Tekst op 'Bekijken' link" value={v('bekijkenTekst')} onChange={(val) => update('bekijkenTekst', val)} placeholder="Bekijken" />
    </Groep>
  </div>
)

// ============================================================
// Reviews
// ============================================================

const ReviewsEditor = ({ v, update }: { v: (f: string) => string; update: (f: string, val: unknown) => void }) => (
  <div className="space-y-4">
    <Groep titel="Bovenaan de pagina">
      <Veld label="Pagina titel" value={v('paginaTitel')} onChange={(val) => update('paginaTitel', val)} placeholder="Reviews" />
      <Veld label="Korte beschrijving" value={v('paginaSubtitel')} onChange={(val) => update('paginaSubtitel', val)} placeholder="Wat onze klanten over ons zeggen" />
    </Groep>

    <Groep titel="Statistieken">
      <Veld label="Tekst onder het gemiddelde" value={v('statsTekst')} onChange={(val) => update('statsTekst', val)} placeholder="Gebaseerd op X reviews" hulptekst="Laat leeg om automatisch het aantal reviews te tonen" />
    </Groep>

    <Groep titel="Wanneer er nog geen reviews zijn">
      <Veld label="Titel" value={v('leegTitel')} onChange={(val) => update('leegTitel', val)} placeholder="Nog geen reviews" />
      <Veld label="Tekst" value={v('leegTekst')} onChange={(val) => update('leegTekst', val)} placeholder="Binnenkort verschijnen hier beoordelingen..." />
    </Groep>

    <Groep titel="Actie-blok onderaan">
      <Veld label="Kop" value={v('ctaTitel')} onChange={(val) => update('ctaTitel', val)} placeholder="Overtuigd?" />
      <Veld label="Beschrijving" value={v('ctaTekst')} onChange={(val) => update('ctaTekst', val)} placeholder="Neem contact met ons op..." />
      <Veld label="Knop tekst" value={v('ctaKnop')} onChange={(val) => update('ctaKnop', val)} placeholder="Contact opnemen" />
    </Groep>
  </div>
)

// ============================================================
// Contact
// ============================================================

const ContactEditor = ({ v, update }: { v: (f: string) => string; update: (f: string, val: unknown) => void }) => (
  <div className="space-y-4">
    <Groep titel="Bovenaan de pagina">
      <Veld label="Pagina titel" value={v('paginaTitel')} onChange={(val) => update('paginaTitel', val)} placeholder="Contact" />
      <Veld label="Korte beschrijving" value={v('paginaSubtitel')} onChange={(val) => update('paginaSubtitel', val)} placeholder="We horen graag van u..." />
    </Groep>

    <Groep titel="Contactgegevens kolom">
      <Veld label="Titel boven contactgegevens" value={v('infoTitel')} onChange={(val) => update('infoTitel', val)} placeholder="Contactgegevens" />
      <Veld label="Titel boven openingstijden" value={v('openingsTitel')} onChange={(val) => update('openingsTitel', val)} placeholder="Openingstijden" />
    </Groep>

    <Groep titel="Contactformulier">
      <Veld label="Titel boven formulier" value={v('formulierTitel')} onChange={(val) => update('formulierTitel', val)} placeholder="Stuur een bericht" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Veld label="Naam veld" value={v('naamLabel')} onChange={(val) => update('naamLabel', val)} placeholder="Naam" />
        <Veld label="E-mail veld" value={v('emailLabel')} onChange={(val) => update('emailLabel', val)} placeholder="E-mail" />
        <Veld label="Telefoon veld" value={v('telefoonLabel')} onChange={(val) => update('telefoonLabel', val)} placeholder="Telefoon (optioneel)" />
        <Veld label="Bericht veld" value={v('berichtLabel')} onChange={(val) => update('berichtLabel', val)} placeholder="Bericht" />
      </div>
      <Veld label="Placeholder in berichtveld" value={v('berichtPlaceholder')} onChange={(val) => update('berichtPlaceholder', val)} placeholder="Waar kunnen we u mee helpen?" />
      <Veld label="Tekst op verzendknop" value={v('verzendKnop')} onChange={(val) => update('verzendKnop', val)} placeholder="Versturen" />
    </Groep>

    <Groep titel="Meldingen na verzenden">
      <Veld label="Succesbericht" value={v('successBericht')} onChange={(val) => update('successBericht', val)} placeholder="Bericht verzonden! We nemen zo snel mogelijk contact op." />
      <Veld label="Foutmelding" value={v('errorBericht')} onChange={(val) => update('errorBericht', val)} placeholder="Er ging iets mis. Probeer het later opnieuw." />
    </Groep>
  </div>
)

export default CmsPaginas
