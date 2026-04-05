import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Lock, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { tenantConfig } from '../config/tenant.config'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Naam moet minimaal 2 tekens bevatten'),
    email: z.string().email('Vul een geldig e-mailadres in'),
    password: z.string().min(8, 'Wachtwoord moet minimaal 8 tekens bevatten'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Wachtwoorden komen niet overeen',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

const Register = () => {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    setError('')

    try {
      await registerUser(data.email, data.password, data.name, 'klant')
      navigate('/cms/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center space-x-2">
                {tenantConfig.branding.logoUrl && (
                  <img
                    src={tenantConfig.branding.logoUrl}
                    alt={tenantConfig.info.naam}
                    className="h-8 w-8 rounded object-contain"
                  />
                )}
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tenantConfig.info.naam}
                </span>
              </div>
              <div className="w-5" />
            </div>
            <CardTitle className="text-center">Account aanmaken</CardTitle>
            <p className="text-center text-gray-600 dark:text-gray-400">
              Maak een account aan bij {tenantConfig.info.naam}
            </p>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Input
                  label="Naam"
                  type="text"
                  icon={<User className="h-4 w-4" />}
                  error={errors.name?.message}
                  {...register('name')}
                />
                <Input
                  label="E-mail"
                  type="email"
                  icon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="Wachtwoord"
                  type="password"
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.password?.message}
                  {...register('password')}
                />
                <Input
                  label="Bevestig wachtwoord"
                  type="password"
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </motion.div>
              )}

              <Button type="submit" size="lg" isFullWidth isLoading={isLoading} disabled={isLoading}>
                Account aanmaken
              </Button>
            </CardContent>

            <CardFooter>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 w-full">
                Al een account?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
                >
                  Inloggen
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

export default Register
