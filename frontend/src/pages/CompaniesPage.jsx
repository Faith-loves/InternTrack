import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Card, EmptyState, Input, Loader, useToast } from '../components'
import { getApiErrorMessage } from '../services/api'
import { companyService } from '../services/companyService'

function CompaniesPage() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm()
  const { showToast } = useToast()

  async function refreshCompanies() {
    try {
      const { data } = await companyService.getAll()
      setCompanies(data)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load companies'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const { data } = await companyService.getAll()
        setCompanies(data)
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load companies'))
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  async function onSubmit(values) {
    const payload = {
      companyName: values.companyName.trim(),
      industry: values.industry?.trim() || '',
      website: values.website?.trim() || '',
      location: values.location?.trim() || '',
      email: values.email?.trim() || '',
      phone: values.phone?.trim() || '',
      linkedin: values.linkedin?.trim() || '',
      notes: values.notes?.trim() || '',
    }

    try {
      await companyService.create(payload)
      reset()
      setSuccess('Company created successfully')
      setError('')
      showToast('Company created successfully')
      refreshCompanies()
    } catch (err) {
      const message = getApiErrorMessage(err, 'Failed to create company')
      setError(message)
      setSuccess('')
      showToast(message, 'error')
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Companies</h2>
        <p className="mt-1 text-sm text-slate-500">Save company notes, contacts, and application history.</p>
      </div>

      <Card className="p-5">
        <h3 className="mb-4 text-lg font-semibold text-slate-950">Add company</h3>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="companyName"
            label="Company name"
            placeholder="BrightStack"
            error={errors.companyName?.message}
            {...register('companyName', { required: 'Company name is required' })}
          />
          <Input id="industry" label="Industry" placeholder="Software" {...register('industry')} />
          <Input
            id="website"
            label="Website"
            type="url"
            placeholder="https://company.com"
            error={errors.website?.message}
            {...register('website', {
              pattern: { value: /^$|^https?:\/\/.+/i, message: 'Enter a valid URL' },
            })}
          />
          <Input id="location" label="Location" placeholder="Remote, Lagos, Hybrid" {...register('location')} />
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="careers@company.com"
            error={errors.email?.message}
            {...register('email', {
              pattern: { value: /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
            })}
          />
          <Input id="phone" label="Phone" placeholder="+234 800 000 0000" {...register('phone')} />
          <Input
            id="linkedin"
            label="LinkedIn"
            type="url"
            placeholder="https://linkedin.com/company/name"
            error={errors.linkedin?.message}
            {...register('linkedin', {
              pattern: { value: /^$|^https?:\/\/.+/i, message: 'Enter a valid URL' },
            })}
          />
          <label className="block md:col-span-2" htmlFor="notes">
            <span className="mb-2 block text-sm font-medium text-slate-700">Notes</span>
            <textarea
              id="notes"
              className="min-h-28 w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="Add hiring notes, contacts, or useful context"
              {...register('notes')}
            />
          </label>
          <div className="md:col-span-2">
            <Button type="submit">Save company</Button>
          </div>
        </form>
        {error && <p className="mt-4 text-sm font-medium text-rose-600">{error}</p>}
        {success && <p className="mt-4 text-sm font-medium text-emerald-700">{success}</p>}
      </Card>

      {loading ? (
        <Loader label="Loading companies" />
      ) : companies.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {companies.map((company) => (
            <Card key={company._id} className="p-5">
              <h3 className="font-semibold text-slate-950">{company.companyName}</h3>
              <div className="mt-4 space-y-2 break-words text-sm text-slate-600">
                <p>{company.industry || 'Industry not set'}</p>
                <p>{company.location || 'Location not set'}</p>
                <p>{company.email || 'Email not set'}</p>
                <p>{company.website || 'Website not set'}</p>
                <p>{company.phone || 'Phone not set'}</p>
                <p>{company.linkedin || 'LinkedIn not set'}</p>
                <p className="leading-6 text-slate-500">{company.notes || 'No notes yet.'}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No companies yet" message="Add a company to start tracking employer details." />
      )}
    </div>
  )
}

export default CompaniesPage
