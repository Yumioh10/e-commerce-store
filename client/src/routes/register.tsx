import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/store/authStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { motion } from 'motion/react'
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'

const registerSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Valid email address required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const { register: registerUser, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await registerUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      });
      setSuccess(true);
      setTimeout(() => {
         navigate({ to:'/account', replace: true});
      }, 2000);
   } catch (err) {
      setError(err instanceof Error ? err.message : "L'inscription a échoué");
   } finally {
      setIsLoading(false);
   }
  } 

  if (isAuthenticated) {
    navigate({ to: '/account', replace: true })
    return null
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-medical-white p-8 rounded-lg shadow-lg max-w-2xl w-full"
      >
        {success && (
          <div className="mb-6 flex items-center space-x-3 bg-teal-100 text-teal-700 p-4 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
            <span>Registretion successfull! Redirecting...</span>
          </div>
        )}
        <h2 className="text-3xl font-bold text-medical-text mb-6">
          Inscription
        </h2>

        {error && (
          <div className="bg-brand-coral/10 border border-brand-coral text-brand-coral px-4 py-3 rounded-lg mb-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input
                {...register('firstName')}
                placeholder="First Name"
                className="w-full px-4 py-3 border rounded-lg"
              />
              {errors.firstName && (
                <p className="text-brand-coral text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <input
                {...register('lastName')}
                placeholder="Last Name"
                className="w-full px-4 py-3 border rounded-lg"
              />
              {errors.lastName && (
                <p className="text-brand-coral text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border rounded-lg"
            />
            {errors.email && (
              <p className="text-brand-coral text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
            {errors.password && (
              <p className="text-brand-coral text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 border rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-brand-coral text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-start space-x-3">
            <input
              {...register('acceptTerms')}
              type="checkbox"
              className="mt-1 w-5 h-5"
            />
            <label className="text-sm text-medical-text">
              I accept the{' '}
              <span className='text-brand-primary'>Terms of Service</span>
            </label>
            {errors.acceptTerms && (
              <p className="text-brand-coral text-sm mt-1">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-primary hover:bg-brand-secondary disabled:bg-medical-gray text-white py-3 rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
