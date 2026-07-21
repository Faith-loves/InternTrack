import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { Badge, Button, Card, EmptyState, Input, Loader, Select, useToast } from '../components'
import { applicationService } from '../services/applicationService'
import { getApiErrorMessage } from '../services/api'
import { interviewService } from '../services/interviewService'
import { formatDate } from '../utils/applications'
import { isDemoSession } from '../utils/authStorage'
import { demoApplications, demoInterviews } from '../utils/demoData'

function InterviewsPage() {
  const [interviews, setInterviews] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isDemo, setIsDemo] = useState(() => isDemoSession())
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const visibleApplications = isDemo ? demoApplications : applications.length ? applications : demoApplications
  const visibleInterviews = isDemo ? demoInterviews : interviews.length ? interviews : demoInterviews

  async function refreshData() {
    if (isDemoSession()) {
      setIsDemo(true)
      setInterviews(demoInterviews)
      setApplications(demoApplications)
      setError('')
      setLoading(false)
      return
    }

    try {
      const [interviewResponse, applicationResponse] = await Promise.all([
        interviewService.getAll(),
        applicationService.getAll(),
      ])
      setInterviews(interviewResponse.data)
      setApplications(applicationResponse.data)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load interviews'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function fetchData() {
      if (isDemoSession()) {
        setIsDemo(true)
        setInterviews(demoInterviews)
        setApplications(demoApplications)
        setLoading(false)
        return
      }

      try {
        const [interviewResponse, applicationResponse] = await Promise.all([
          interviewService.getAll(),
          applicationService.getAll(),
        ])
        setInterviews(interviewResponse.data)
        setApplications(applicationResponse.data)
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load interviews'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  async function onSubmit(values) {
    if (isDemo) {
      const message = 'Demo interviews are read-only so recruiter preview data stays synchronized.'
      setSuccess(message)
      setError('')
      showToast(message)
      return
    }
    const selectedApplication = visibleApplications.find((application) => application._id === values.applicationId)
    const payload = {
      applicationId: values.applicationId,
      companyName: selectedApplication?.companyName || '',
      jobTitle: selectedApplication?.jobTitle || '',
      date: values.date,
      time: values.time,
      interviewType: values.interviewType?.trim() || '',
      interviewLink: values.interviewLink?.trim() || '',
      location: values.location?.trim() || '',
      preparationNotes: values.preparationNotes?.trim() || '',
      preparationChecklist: [
        { text: 'Research the company', completed: false },
        { text: 'Review the job description', completed: false },
        { text: 'Prepare STAR stories', completed: false },
      ],
      interviewNotes: values.interviewNotes?.trim() || '',
      interviewFeedback: values.interviewFeedback?.trim() || '',
      outcome: values.outcome || 'scheduled',
    }

    try {
      await interviewService.create(payload)
      reset()
      setSuccess('Interview created successfully')
      setError('')
      showToast('Interview created successfully')
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      refreshData()
    } catch (err) {
      const message = getApiErrorMessage(err, 'Failed to create interview')
      setError(message)
      setSuccess('')
      showToast(message, 'error')
    }
  }

  async function updateInterview(id, updates) {
    if (isDemo) {
      showToast('Demo checklist is read-only')
      return
    }
    try {
      await interviewService.update(id, updates)
      showToast('Interview updated')
      refreshData()
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Failed to update interview'), 'error')
    }
  }

  function getCalendarLink(interview) {
    const start = new Date(`${interview.date?.slice(0, 10)}T${interview.time || '09:00'}`)
    const end = new Date(start)
    end.setHours(start.getHours() + 1)
    const format = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `${interview.companyName} - ${interview.jobTitle}`,
      dates: `${format(start)}/${format(end)}`,
      details: interview.preparationNotes || '',
      location: interview.interviewLink || interview.location || '',
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  function generateThankYouEmail(interview) {
    const email = `Subject: Thank you for the interview

Hi,

Thank you for taking the time to speak with me about the ${interview.jobTitle} role at ${interview.companyName}. I enjoyed learning more about the opportunity and the team.

I appreciate your time and look forward to hearing about the next steps.

Best regards,`

    navigator.clipboard?.writeText(email)
    setSuccess('Interview thank-you email copied')
    showToast('Interview thank-you email copied')
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Interviews</h2>
        <p className="mt-1 text-sm text-slate-500">Plan upcoming calls and preparation notes.</p>
      </div>

      <Card className="p-5">
        <h3 className="mb-4 text-lg font-semibold text-slate-950">Add interview</h3>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <Select
            id="applicationId"
            label="Application"
            options={[
              { value: '', label: 'Select application' },
              ...visibleApplications.map((application) => ({
                value: application._id,
                label: `${application.companyName} - ${application.jobTitle}`,
              })),
            ]}
            error={errors.applicationId?.message}
            {...register('applicationId', { required: 'Application is required' })}
          />
          <Input
            id="date"
            label="Date"
            type="date"
            error={errors.date?.message}
            {...register('date', { required: 'Date is required' })}
          />
          <Input
            id="time"
            label="Time"
            type="time"
            error={errors.time?.message}
            {...register('time', { required: 'Time is required' })}
          />
          <Input id="interviewType" label="Interview type" placeholder="Technical interview" {...register('interviewType')} />
          <Select
            id="outcome"
            label="Outcome"
            options={[
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'completed', label: 'Completed' },
              { value: 'passed', label: 'Passed' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'offer', label: 'Offer' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
            {...register('outcome')}
          />
          <Input
            id="interviewLink"
            label="Interview link"
            placeholder="https://meet.example.com"
            error={errors.interviewLink?.message}
            {...register('interviewLink', {
              pattern: { value: /^$|^https?:\/\/.+/i, message: 'Enter a valid URL' },
            })}
          />
          <Input id="location" label="Location" placeholder="Remote or office address" {...register('location')} />
          <label className="block md:col-span-2" htmlFor="preparationNotes">
            <span className="mb-2 block text-sm font-medium text-slate-700">Preparation notes</span>
            <textarea
              id="preparationNotes"
              className="min-h-28 w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="Topics to review, questions to ask, portfolio notes"
              {...register('preparationNotes')}
            />
          </label>
          <label className="block md:col-span-2" htmlFor="interviewNotes">
            <span className="mb-2 block text-sm font-medium text-slate-700">Interview notes</span>
            <textarea
              id="interviewNotes"
              className="min-h-24 w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="Notes during or after the interview"
              {...register('interviewNotes')}
            />
          </label>
          <label className="block md:col-span-2" htmlFor="interviewFeedback">
            <span className="mb-2 block text-sm font-medium text-slate-700">Interview feedback</span>
            <textarea
              id="interviewFeedback"
              className="min-h-24 w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="Feedback received or self-reflection"
              {...register('interviewFeedback')}
            />
          </label>
          <div className="md:col-span-2">
            <Button type="submit">{isDemo ? 'Preview only' : 'Save interview'}</Button>
          </div>
        </form>
        {error && <p className="mt-4 text-sm font-medium text-rose-600">{error}</p>}
        {success && <p className="mt-4 text-sm font-medium text-emerald-700">{success}</p>}
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-950">Upcoming interviews</h3>
        {loading ? (
          <Loader label="Loading interviews" />
        ) : error ? (
          <EmptyState title="Could not load interviews" message={error} />
        ) : visibleInterviews.length > 0 ? (
          visibleInterviews.map((interview) => (
            <Card key={interview._id} className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h4 className="font-semibold text-slate-950">
                    {interview.companyName} - {interview.jobTitle}
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDate(interview.date)} at {interview.time}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{interview.interviewType || 'Interview type not set'}</p>
                  <p className="mt-1 break-words text-sm text-slate-600">
                    {interview.interviewLink || interview.location || 'Location/link not set'}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {interview.preparationNotes || 'No preparation notes yet.'}
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-slate-700">Preparation checklist</p>
                    {(interview.preparationChecklist?.length ? interview.preparationChecklist : [
                      { text: 'Research the company', completed: false },
                      { text: 'Review the job description', completed: false },
                      { text: 'Prepare STAR stories', completed: false },
                    ]).map((item, index) => (
                      <label key={`${interview._id}-${index}`} className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-emerald-600"
                          checked={item.completed}
                          onChange={(event) => {
                            const checklist = [...(interview.preparationChecklist || [])]
                            checklist[index] = { ...item, completed: event.target.checked }
                            updateInterview(interview._id, { preparationChecklist: checklist })
                          }}
                        />
                        {item.text}
                      </label>
                    ))}
                  </div>
                  {interview.interviewNotes && <p className="mt-3 text-sm text-slate-600">Notes: {interview.interviewNotes}</p>}
                  {interview.interviewFeedback && <p className="mt-2 text-sm text-slate-600">Feedback: {interview.interviewFeedback}</p>}
                </div>
                <div className="flex flex-col gap-2 sm:items-end">
                  {isDemo && <Badge tone="info">Demo</Badge>}
                  <Badge tone="info">{interview.outcome || 'scheduled'}</Badge>
                  <a href={getCalendarLink(interview)} target="_blank" rel="noreferrer">
                    <Button variant="secondary">Add to calendar</Button>
                  </a>
                  <Button variant="secondary" onClick={() => generateThankYouEmail(interview)}>
                    Copy thank-you email
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <EmptyState title="No upcoming interviews" message="Add an interview to keep your preparation visible." />
        )}
      </div>
    </div>
  )
}

export default InterviewsPage
