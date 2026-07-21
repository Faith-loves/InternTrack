import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Card, Input, Loader, useToast } from '../components'
import { getApiErrorMessage } from '../services/api'
import { authService } from '../services/authService'
import { getStoredUser, isDemoSession, updateStoredUser } from '../utils/authStorage'
import { getDemoWorkspace, updateDemoUser } from '../utils/demoWorkspace'

function SettingsPage() {
  const [settings, setSettings] = useState(null)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm()
  const { showToast } = useToast()
  const isDemo = isDemoSession()

  useEffect(() => {
    async function fetchSettings() {
      if (isDemo) {
        const user = getDemoWorkspace().user || getStoredUser()
        setSettings(user)
        reset({
          fullName: user.fullName || '',
          email: user.email || '',
          preferredRole: user.preferredRole || '',
          location: user.location || '',
          portfolioLink: user.portfolioLink || '',
          linkedinLink: user.linkedinLink || '',
          githubLink: user.githubLink || '',
        })
        setLoading(false)
        return
      }

      try {
        const { data } = await authService.getCurrentUser()
        setSettings(data.user)
        reset({
          fullName: data.user.fullName || '',
          email: data.user.email || '',
          preferredRole: data.user.preferredRole || '',
          location: data.user.location || '',
          portfolioLink: data.user.portfolioLink || '',
          linkedinLink: data.user.linkedinLink || '',
          githubLink: data.user.githubLink || '',
        })
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load profile'))
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [isDemo, reset])

  async function onSubmit(values) {
    const payload = {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      preferredRole: values.preferredRole?.trim() || '',
      location: values.location?.trim() || '',
      portfolioLink: values.portfolioLink?.trim() || '',
      linkedinLink: values.linkedinLink?.trim() || '',
      githubLink: values.githubLink?.trim() || '',
    }

    try {
      const updatedUser = isDemo ? updateDemoUser(payload).user : (await authService.updateProfile(payload)).data.user
      setSettings(updatedUser)
      updateStoredUser(updatedUser)
      setSaved(true)
      setError('')
      showToast('Settings saved')
    } catch (err) {
      const message = getApiErrorMessage(err, 'Failed to update profile')
      setError(message)
      setSaved(false)
      showToast(message, 'error')
    }
  }

  if (loading) return <Loader label="Loading settings" />
  if (!settings && error) {
    return (
      <div className="max-w-3xl">
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Settings</h2>
        <p className="mt-1 text-sm text-slate-500">Manage your profile details for internship applications.</p>
      </div>

      <Card className="p-5">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="fullName"
            label="Name"
            error={errors.fullName?.message}
            {...register('fullName', { required: 'Name is required' })}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
            })}
          />
          <Input id="preferredRole" label="Preferred role" {...register('preferredRole')} />
          <Input id="location" label="Location" {...register('location')} />
          <Input
            id="portfolioLink"
            label="Portfolio link"
            type="url"
            error={errors.portfolioLink?.message}
            {...register('portfolioLink', {
              pattern: { value: /^$|^https?:\/\/.+/i, message: 'Enter a valid URL' },
            })}
          />
          <Input
            id="linkedinLink"
            label="LinkedIn"
            type="url"
            error={errors.linkedinLink?.message}
            {...register('linkedinLink', {
              pattern: { value: /^$|^https?:\/\/.+/i, message: 'Enter a valid URL' },
            })}
          />
          <Input
            id="githubLink"
            label="GitHub"
            type="url"
            error={errors.githubLink?.message}
            {...register('githubLink', {
              pattern: { value: /^$|^https?:\/\/.+/i, message: 'Enter a valid URL' },
            })}
          />
          <div className="md:col-span-2">
            <Button type="submit">Save settings</Button>
            {error && <span className="ml-3 text-sm font-medium text-rose-600">{error}</span>}
            {saved && <span className="ml-3 text-sm font-medium text-emerald-700">Settings saved</span>}
          </div>
        </form>
      </Card>
    </div>
  )
}

export default SettingsPage

