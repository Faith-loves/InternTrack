import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApplicationForm, Card, useToast } from '../components'
import { getApiErrorMessage } from '../services/api'
import { applicationService } from '../services/applicationService'

function AddApplicationPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  async function handleSubmit(application) {
    try {
      setSaving(true)
      const { data } = await applicationService.create(application)
      showToast('Application created successfully')
      navigate(`/success?kind=application-created&next=/applications/${data._id}`)
    } catch (err) {
      const message = getApiErrorMessage(err, 'Failed to save application')
      setError(message)
      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Add application</h2>
        <p className="mt-1 text-sm text-slate-500">Save the key details for a new internship opportunity.</p>
      </div>

      <Card className="p-5">
        {error && <p className="mb-4 text-sm font-medium text-rose-600">{error}</p>}
        <ApplicationForm submitLabel={saving ? 'Saving...' : 'Save application'} onSubmit={handleSubmit} />
      </Card>
    </div>
  )
}

export default AddApplicationPage
