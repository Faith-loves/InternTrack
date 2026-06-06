import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input } from '../components'
import { getApiErrorMessage } from '../services/api'
import { authService } from '../services/authService'
import { saveSession } from '../utils/authStorage'

function SignupPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values) {
    try {
      setLoading(true)
      setError('')
      const payload = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      }
      const { data } = await authService.signup(payload)
      saveSession(data.token, data.user, data.refreshToken)
      navigate('/dashboard')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Signup failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-6 sm:py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <Link to="/" className="mb-6 block text-center text-2xl font-black text-slate-950 sm:mb-8">
          InternTrack
        </Link>
        <h1 className="text-2xl font-bold text-slate-950">Create your account</h1>
        <p className="mt-2 text-sm text-slate-500">Start tracking applications with a clean, focused workflow.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="fullName"
            label="Full name"
            placeholder="Jane Doe"
            error={errors.fullName?.message}
            {...register('fullName', { required: 'Full name is required' })}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="jane@example.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          <Input
            id="confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="Confirm password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Confirm your password',
              validate: (value, formValues) => value === formValues.password || 'Passwords do not match',
            })}
          />
          {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign up'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
            Login
          </Link>
        </p>
      </section>
    </main>
  )
}

export default SignupPage
