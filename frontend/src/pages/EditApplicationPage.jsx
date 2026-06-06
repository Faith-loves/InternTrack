import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApplicationForm, Button, Card, Loader, useToast } from '../components'
import { getApiErrorMessage } from '../services/api'
import { applicationService } from '../services/applicationService'

function EditApplicationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    async function fetchApplication() {
      try {
        const { data } = await applicationService.getById(id)
        setApplication(data)
      } catch {
        setApplication(null)
      } finally {
        setLoading(false)
      }
    }

    fetchApplication()
  }, [id])

  async function handleSubmit(updates) {
    try {
      setSaving(true)
      await applicationService.update(id, updates)
      sessionStorage.setItem('successMessage', 'Application updated successfully')
      setSuccess('Application updated successfully')
      showToast('Application updated successfully')
      navigate(`/applications/${id}`)
    } catch (err) {
      const message = getApiErrorMessage(err, 'Failed to update application')
      setError(message)
      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader label="Loading application" />

  if (!application) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-slate-950">Application not found</h2>
        <p className="mt-2 text-sm text-slate-500">This application may have been deleted.</p>
        <Link to="/applications" className="mt-5 inline-flex">
          <Button>Back to applications</Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Edit application</h2>
        <p className="mt-1 text-sm text-slate-500">Update {application.jobTitle} at {application.companyName}.</p>
      </div>

      <Card className="p-5">
        {error && <p className="mb-4 text-sm font-medium text-rose-600">{error}</p>}
        {success && <p className="mb-4 text-sm font-medium text-emerald-700">{success}</p>}
        <ApplicationForm initialValues={application} submitLabel={saving ? 'Updating...' : 'Update application'} onSubmit={handleSubmit} />
      </Card>
    </div>
  )
}

export default EditApplicationPage
