import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

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

type ProfielValues = z.infer<typeof profielSchema>
type WachtwoordValues = z.infer<typeof wachtwoordSchema>

const CmsInstellingen = () => {
  const { user, updateUserProfile, updateUserPassword } = useAuth()
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const profielForm = useForm<ProfielValues>({
    resolver: zodResolver(profielSchema),
    defaultValues: { naam: user?.displayName || '' },
  })

  const wachtwoordForm = useForm<WachtwoordValues>({
    resolver: zodResolver(wachtwoordSchema),
    defaultValues: { nieuwWachtwoord: '', bevestig: '' },
  })

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
        <p className="text-gray-500 dark:text-gray-400 mt-1">Beheer je account instellingen.</p>
      </div>

      {/* Profiel */}
      <Card>
        <CardHeader>
          <CardTitle>Profiel</CardTitle>
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
              <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
            <Button type="submit" isLoading={savingProfile} icon={<Save size={16} />}>
              Opslaan
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Wachtwoord */}
      <Card>
        <CardHeader>
          <CardTitle>Wachtwoord wijzigen</CardTitle>
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
