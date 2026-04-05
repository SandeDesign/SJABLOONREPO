import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTenantConfig } from '../../../hooks/useTenantConfig'
import { addDocument, Timestamp } from '../../../lib/firestore'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

const contactSchema = z.object({
  naam: z.string().min(2, 'Naam is verplicht'),
  email: z.string().email('Ongeldig e-mailadres'),
  telefoon: z.string().optional(),
  bericht: z.string().min(10, 'Bericht moet minimaal 10 tekens bevatten'),
})

type ContactFormValues = z.infer<typeof contactSchema>

const ContactSection = () => {
  const { config } = useTenantConfig()
  const [isLoading, setIsLoading] = useState(false)

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
      toast.success('Bericht verzonden! We nemen zo snel mogelijk contact op.')
      reset()
    } catch {
      toast.error('Er ging iets mis. Probeer het later opnieuw.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
          >
            Contact
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contactgegevens */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Neem contact op
            </h3>
            <div className="space-y-4">
              {config.info.email && (
                <a
                  href={`mailto:${config.info.email}`}
                  className="flex items-center gap-3 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <Mail className="text-primary-600" size={18} />
                  </div>
                  {config.info.email}
                </a>
              )}
              {config.info.telefoon && (
                <a
                  href={`tel:${config.info.telefoon}`}
                  className="flex items-center gap-3 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <Phone className="text-primary-600" size={18} />
                  </div>
                  {config.info.telefoon}
                </a>
              )}
              {config.info.adres && (
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <MapPin className="text-primary-600" size={18} />
                  </div>
                  {config.info.adres}
                </div>
              )}
            </div>
          </motion.div>

          {/* Formulier */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Naam" error={errors.naam?.message} {...register('naam')} />
              <Input
                label="E-mail"
                type="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input label="Telefoon" type="tel" {...register('telefoon')} />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bericht
                </label>
                <textarea
                  rows={4}
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
                isFullWidth
              >
                Versturen
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
