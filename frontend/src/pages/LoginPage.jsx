import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Input } from '../components'
import { getApiErrorMessage } from '../services/api'
import { authService } from '../services/authService'
import { saveDemoSession, saveSession } from '../utils/authStorage'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function finishLogin(loginRequest) {
    try {
      setLoading(true)
      setError('')
      const { data } = await loginRequest()
      saveSession(data.token, data.user, data.refreshToken)
      navigate(location.state?.from?.pathname || '/dashboard')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(values) {
    return finishLogin(() => authService.login(values))
  }

  function handleDemoLogin() {
    setLoading(true)
    setError('')
    saveDemoSession()
    navigate('/dashboard')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-6 sm:py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <Link to="/" className="mb-6 block text-center text-2xl font-black text-slate-950 sm:mb-8">
          InternTrack
        </Link>
        <h1 className="text-2xl font-bold text-slate-950">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Login to continue managing your internship search.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
            {...register('password', { required: 'Password is required' })}
          />
          {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <Button type="button" variant="secondary" className="w-full" disabled={loading} onClick={handleDemoLogin}>
            Demo login for recruiters
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New to InternTrack?{' '}
          <Link to="/signup" className="font-semibold text-emerald-700 hover:text-emerald-800">
            Create account
          </Link>
        </p>
      </section>
    </main>
  )
}

export default LoginPage
