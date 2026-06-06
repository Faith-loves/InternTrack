import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApplicationTimeline, Badge, Button, Card, Loader, Modal, useToast } from '../components'
import { getApiErrorMessage } from '../services/api'
import { applicationService } from '../services/applicationService'
import { formatDate, formatSalary, getJobTypeLabel, getStatusLabel, getStatusTone } from '../utils/applications'

function DetailItem({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 break-all font-semibold text-slate-950 sm:break-words">{value || 'Not set'}</dd>
    </div>
  )
}

function ApplicationDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteError, setDeleteError] = useState('')
  const [success, setSuccess] = useState(() => {
    const message = sessionStorage.getItem('successMessage')
    sessionStorage.removeItem('successMessage')
    return message || ''
  })
  const { showToast } = useToast()

  useEffect(() => {
    if (success) {
      showToast(success)
    }
  }, [showToast, success])

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

  async function handleDelete() {
    try {
      await applicationService.remove(id)
      sessionStorage.setItem('successMessage', 'Application deleted successfully')
      showToast('Application deleted successfully')
      navigate('/applications')
    } catch (err) {
      const message = getApiErrorMessage(err, 'Failed to delete application')
      setDeleteError(message)
      showToast(message, 'error')
    }
  }

  function generateFollowUpEmail() {
    const recruiterName = application.recruiterName || 'there'
    const email = `Subject: Following up on ${application.jobTitle} application

Hi ${recruiterName},

I hope you are doing well. I wanted to follow up on my application for the ${application.jobTitle} role at ${application.companyName}. I am still very interested in the opportunity and would be grateful for any update you can share.

Thank you for your time and consideration.

Best regards,`

    setSuccess('Follow-up email generated')
    showToast('Follow-up email copied')
    navigator.clipboard?.writeText(email)
    return email
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
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Application details</h2>
          <p className="mt-1 text-sm text-slate-500">Everything saved for this opportunity.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to={`/applications/${id}/edit`}>
            <Button variant="secondary" className="w-full sm:w-auto">Edit application</Button>
          </Link>
          <Button variant="danger" className="w-full sm:w-auto" onClick={() => setDeleteModalOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      {success && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{success}</p>}

      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-950">{application.jobTitle}</h3>
            <p className="mt-1 text-slate-500">{application.companyName}</p>
          </div>
          <Badge tone={getStatusTone(application.status)}>{getStatusLabel(application.status)}</Badge>
        </div>
        <dl className="mt-6 grid gap-4 md:grid-cols-3">
          <DetailItem label="Job type" value={getJobTypeLabel(application.jobType)} />
          <DetailItem label="Location" value={application.location} />
          <DetailItem label="Date applied" value={formatDate(application.dateApplied)} />
          <DetailItem label="Application deadline" value={formatDate(application.applicationDeadline)} />
          <DetailItem label="Follow-up date" value={formatDate(application.followUpDate)} />
          <DetailItem label="Application source" value={application.applicationSource} />
          <DetailItem label="Salary" value={formatSalary(application)} />
          <DetailItem label="Recruiter name" value={application.recruiterName} />
          <DetailItem label="Recruiter email" value={application.recruiterEmail} />
          <DetailItem label="CV used" value={application.cvUsed} />
          <DetailItem label="Cover letter used" value={application.coverLetterUsed} />
          <DetailItem label="Application link" value={application.applicationLink} />
          <div className="md:col-span-3">
            <dt className="text-sm font-medium text-slate-500">Job posting archive</dt>
            <dd className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {application.jobPostingArchive || 'No posting archived yet.'}
            </dd>
          </div>
          <div className="md:col-span-3">
            <dt className="text-sm font-medium text-slate-500">Rejection reason</dt>
            <dd className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {application.rejectionReason || 'No rejection reason saved.'}
            </dd>
          </div>
          <div className="md:col-span-3">
            <dt className="text-sm font-medium text-slate-500">Notes</dt>
            <dd className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {application.notes || 'No notes added.'}
            </dd>
          </div>
        </dl>
      </Card>

      <Card className="p-5">
        <ApplicationTimeline application={application} />
      </Card>

      <Card className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Follow-up email generator</h3>
            <p className="mt-1 text-sm text-slate-500">Uses company, role, and recruiter name.</p>
          </div>
          <Button variant="secondary" onClick={generateFollowUpEmail}>Copy email</Button>
        </div>
      </Card>

      <Modal open={deleteModalOpen} title="Delete application?" onClose={() => setDeleteModalOpen(false)}>
        <p className="text-sm leading-6 text-slate-600">
          This will remove {application.jobTitle} at {application.companyName}.
        </p>
        {deleteError && <p className="mt-3 text-sm font-medium text-rose-600">{deleteError}</p>}
        <div className="mt-5 flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" className="w-full sm:w-auto" onClick={handleDelete}>
            Delete application
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default ApplicationDetailsPage
