import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApplicationForm, Button, Card, Loader, useToast } from '../components'
import { getApiErrorMessage } from '../services/api'
import { applicationService } from '../services/applicationService'
import { documentService } from '../services/documentService'
import { isDemoSession } from '../utils/authStorage'
import { getDemoWorkspace, updateDemoApplication } from '../utils/demoWorkspace'

function EditApplicationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [cvOptions, setCvOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()
  const isDemo = isDemoSession()

  useEffect(() => {
    async function fetchApplication() {
      if (isDemo) {
        const workspace = getDemoWorkspace()
        setApplication(workspace.applications.find((item) => item._id === id) || null)
        setCvOptions(workspace.documents.map((document) => ({ value: document.fileName, label: document.fileName })))
        setLoading(false)
        return
      }

      try {
        const [{ data: applicationData }, { data: documentsData }] = await Promise.all([
          applicationService.getById(id),
          documentService.getAll().catch(() => ({ data: [] })),
        ])
        setApplication(applicationData)
        setCvOptions(documentsData.map((document) => ({ value: document.fileName, label: document.fileName })))
      } catch {
        setApplication(null)
      } finally {
        setLoading(false)
      }
    }

    fetchApplication()
  }, [id, isDemo])

  async function handleSubmit(updates) {
    try {
      setSaving(true)

      if (isDemo) {
        updateDemoApplication(id, updates)
        sessionStorage.setItem('successMessage', 'Application updated successfully')
        showToast('Application updated successfully')
        navigate(`/applications/${id}`)
        return
      }

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
        <ApplicationForm initialValues={application} submitLabel={saving ? 'Updating...' : 'Update application'} cvOptions={cvOptions} onSubmit={handleSubmit} />
      </Card>
    </div>
  )
}

export default EditApplicationPage
