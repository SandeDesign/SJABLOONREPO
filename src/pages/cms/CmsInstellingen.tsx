import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, Building2, User, Lock, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { useTenantConfig } from '../../hooks/useTenantConfig'
import { setDocument } from '../../lib/firestore'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

const bedrijfSchema = z.object({
  naam: z.string().min(1, 'Bedrijfsnaam is verplicht'),
  slogan: z.string().optional(),
  kvk: z.string().optional(),
  email: z.string().email('Ongeldig e-mailadres').or(z.literal('')).optional(),
  telefoon: z.string().optional(),
  adres: z.string().optional(),
})

const profielSchema = z.object({
  naam: z.string().min(2, 'Naam is verplicht'),
})

const wachtwoordSchema = z
  .object({
    nieuwWachtwoord: z.string().min(8, 'Minimaal 8 tekens'),
    bevestig: z.string(),
  })
  .refine((d) => d.nieuwWachtwoord === d.bevestig, {
    message: 'Wachtwoorden komen niet overeen',
    path: ['bevestig'],
  })

type BedrijfValues = z.infer<typeof bedrijfSchema>
type ProfielValues = z.infer<typeof profielSchema>
type WachtwoordValues = z.infer<typeof wachtwoordSchema>

const CmsInstellingen = () => {
  const { user, updateUserProfile, updateUserPassword } = useAuth()
  const { config } = useTenantConfig()
  const [savingBedrijf, setSavingBedrijf] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [openingsTijden, setOpeningsTijden] = useState('')

  const bedrijfForm = useForm<BedrijfValues>({
    resolver: zodResolver(bedrijfSchema),
    defaultValues: {
      naam: config.info.naam || '',
      slogan: config.info.slogan || '',
      kvk: config.info.kvk || '',
      email: config.info.email || '',
      telefoon: config.info.telefoon || '',
      adres: config.info.adres || '',
    },
  })

  useEffect(() => {
    bedrijfForm.reset({
      naam: config.info.naam || '',
      slogan: config.info.slogan || '',
      kvk: config.info.kvk || '',
      email: config.info.email || '',
      telefoon: config.info.telefoon || '',
      adres: config.info.adres || '',
    })
    setOpeningsTijden(config.seo.localBusiness.openingHours.join('\n'))
  }, [
    config.info.naam,
    config.info.slogan,
    config.info.kvk,
    config.info.email,
    config.info.telefoon,
    config.info.adres,
    config.seo.localBusiness.openingHours,
  ])

  const profielForm = useForm<ProfielValues>({
    resolver: zodResolver(profielSchema),
    defaultValues: { naam: user?.displayName || '' },
  })

  const wachtwoordForm = useForm<WachtwoordValues>({
    resolver: zodResolver(wachtwoordSchema),
    defaultValues: { nieuwWachtwoord: '', bevestig: '' },
  })

  const onBedrijfSubmit = async (data: BedrijfValues) => {
    setSavingBedrijf(true)
    try {
      const openingHours = openingsTijden
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
      await setDocument('config/tenant', {
        info: data,
        seo: {
          ...config.seo,
          localBusiness: {
            ...config.seo.localBusiness,
            openingHours,
          },
        },
      })
      toast.success('Bedrijfsinformatie opgeslagen')
    } catch {
      toast.error('Opslaan mislukt')
    } finally {
      setSavingBedrijf(false)
    }
  }

  const onProfielSubmit = async (data: ProfielValues) => {
    setSavingProfile(true)
    try {
      await updateUserProfile(data.naam)
      toast.success('Profiel bijgewerkt')
    } catch {
      toast.error('Profiel bijwerken mislukt')
    } finally {
      setSavingProfile(false)
    }
  }

  const onWachtwoordSubmit = async (data: WachtwoordValues) => {
    setSavingPassword(true)
    try {
      await updateUserPassword(data.nieuwWachtwoord)
      toast.success('Wachtwoord gewijzigd')
      wachtwoordForm.reset()
    } catch {
      toast.error('Wachtwoord wijzigen mislukt')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Instellingen</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Beheer je bedrijfsgegevens en accountinstellingen.
        </p>
      </div>

      {/* Bedrijfsinformatie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 size={18} />
            Bedrijfsinformatie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={bedrijfForm.handleSubmit(onBedrijfSubmit)} className="space-y-4">
            <Input
              label="Bedrijfsnaam"
              error={bedrijfForm.formState.errors.naam?.message}
              {...bedrijfForm.register('naam')}
            />
            <Input
              label="Slogan / tagline"
              placeholder="Bijv. De beste service in de regio"
              {...bedrijfForm.register('slogan')}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="E-mailadres"
                type="email"
                placeholder="info@bedrijf.nl"
                error={bedrijfForm.formState.errors.email?.message}
                {...bedrijfForm.register('email')}
              />
              <Input
                label="Telefoonnummer"
                type="tel"
                placeholder="+31 6 12345678"
                {...bedrijfForm.register('telefoon')}
              />
            </div>
            <Input
              label="Adres"
              placeholder="Straat 1, 1234 AB Stad"
              {...bedrijfForm.register('adres')}
            />
            <Input
              label="KVK-nummer"
              placeholder="12345678"
              {...bedrijfForm.register('kvk')}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  Openingstijden
                </span>
              </label>
              <p className="text-xs text-gray-400 mb-2">Één regel per tijdstip, bijv. "Maandag – Vrijdag: 09:00 – 17:00"</p>
              <textarea
                rows={4}
                value={openingsTijden}
                onChange={(e) => setOpeningsTijden(e.target.value)}
                placeholder={`Maandag – Vrijdag: 09:00 – 17:00\nZaterdag: 10:00 – 14:00`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>

            <Button type="submit" isLoading={savingBedrijf} icon={<Save size={16} />}>
              Bedrijfsgegevens opslaan
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Profiel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={18} />
            Mijn profiel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={profielForm.handleSubmit(onProfielSubmit)} className="space-y-4">
            <Input
              label="Naam"
              error={profielForm.formState.errors.naam?.message}
              {...profielForm.register('naam')}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                E-mail
              </label>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
            </div>
            <Button type="submit" isLoading={savingProfile} icon={<Save size={16} />}>
              Profiel opslaan
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Wachtwoord */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock size={18} />
            Wachtwoord wijzigen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={wachtwoordForm.handleSubmit(onWachtwoordSubmit)} className="space-y-4">
            <Input
              label="Nieuw wachtwoord"
              type="password"
              error={wachtwoordForm.formState.errors.nieuwWachtwoord?.message}
              {...wachtwoordForm.register('nieuwWachtwoord')}
            />
            <Input
              label="Bevestig wachtwoord"
              type="password"
              error={wachtwoordForm.formState.errors.bevestig?.message}
              {...wachtwoordForm.register('bevestig')}
            />
            <Button type="submit" isLoading={savingPassword} icon={<Save size={16} />}>
              Wachtwoord wijzigen
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CmsInstellingen
