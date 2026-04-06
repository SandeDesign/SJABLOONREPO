import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTenantConfig } from '../../../hooks/useTenantConfig'
import { useContent } from '../../../hooks/useContent'
import { addDocument, Timestamp } from '../../../lib/firestore'
import PageHeader from './HeroSection'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { Card, CardContent } from '../../../components/ui/Card'

interface ContactContent {
  id?: string
  paginaTitel?: string
  paginaSubtitel?: string
  infoTitel?: string
  openingsTitel?: string
  formulierTitel?: string
  naamLabel?: string
  emailLabel?: string
  telefoonLabel?: string
  berichtLabel?: string
  berichtPlaceholder?: string
  verzendKnop?: string
  successBericht?: string
  errorBericht?: string
}

const contactSchema = z.object({
  naam: z.string().min(2, 'Naam is verplicht'),
  email: z.string().email('Ongeldig e-mailadres'),
  telefoon: z.string().optional(),
  bericht: z.string().min(10, 'Bericht moet minimaal 10 tekens bevatten'),
})

type ContactFormValues = z.infer<typeof contactSchema>

const ContactPage = () => {
  const { config } = useTenantConfig()
  const { data: c, loading } = useContent<ContactContent>('contact')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    document.title = `${c?.paginaTitel || 'Contact'} — ${config.info.naam}`
  }, [config.info.naam, c?.paginaTitel])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormValues) => {
    setIsLoading(true)
    try {
      await addDocument('aanvragen', {
        ...data,
        status: 'nieuw',
        createdAt: Timestamp.now(),
      })
      toast.success(c?.successBericht || 'Bericht verzonden! We nemen zo snel mogelijk contact op.')
      reset()
    } catch {
      toast.error(c?.errorBericht || 'Er ging iets mis. Probeer het later opnieuw.')
    } finally {
      setIsLoading(false)
    }
  }

  const contactInfo = [
    { icoon: Mail, label: 'E-mail', waarde: config.info.email, href: `mailto:${config.info.email}` },
    { icoon: Phone, label: 'Telefoon', waarde: config.info.telefoon, href: `tel:${config.info.telefoon}` },
    { icoon: MapPin, label: 'Adres', waarde: config.info.adres },
  ].filter((ci) => ci.waarde)

  return (
    <div className={`transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
      <PageHeader
        titel={c?.paginaTitel || 'Contact'}
        subtitel={c?.paginaSubtitel || 'We horen graag van u. Neem gerust contact op.'}
      />

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {c?.infoTitel || 'Contactgegevens'}
              </h2>

              <div className="space-y-4 mb-8">
                {contactInfo.map((info) => (
                  <Card key={info.label}>
                    <CardContent className="py-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                        <info.icoon className="text-primary-600" size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          {info.label}
                        </p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-gray-900 dark:text-white hover:text-primary-600 font-medium"
                          >
                            {info.waarde}
                          </a>
                        ) : (
                          <p className="text-gray-900 dark:text-white font-medium">
                            {info.waarde}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {config.seo.localBusiness.openingHours.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    <Clock size={18} /> {c?.openingsTitel || 'Openingstijden'}
                  </h3>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    {config.seo.localBusiness.openingHours.map((uur, i) => (
                      <li key={i}>{uur}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="lg:col-span-3">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {c?.formulierTitel || 'Stuur een bericht'}
                  </h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label={c?.naamLabel || 'Naam'} error={errors.naam?.message} {...register('naam')} />
                      <Input
                        label={c?.emailLabel || 'E-mail'}
                        type="email"
                        error={errors.email?.message}
                        {...register('email')}
                      />
                    </div>
                    <Input label={c?.telefoonLabel || 'Telefoon (optioneel)'} type="tel" {...register('telefoon')} />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {c?.berichtLabel || 'Bericht'}
                      </label>
                      <textarea
                        rows={5}
                        placeholder={c?.berichtPlaceholder || 'Waar kunnen we u mee helpen?'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white resize-none"
                        {...register('bericht')}
                      />
                      {errors.bericht && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.bericht.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      icon={<Send size={16} />}
                      size="lg"
                    >
                      {c?.verzendKnop || 'Versturen'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
