import { useForm } from 'react-hook-form'
import Button from './Button'
import Input from './Input'
import Select from './Select'
import { APPLICATION_STATUSES, applicationSourceOptions, jobTypeOptions, statusOptions } from '../utils/applications'

const emptyApplication = {
  companyName: '',
  jobTitle: '',
  jobType: 'internship',
  location: '',
  applicationLink: '',
  dateApplied: '',
  status: APPLICATION_STATUSES.APPLIED,
  recruiterName: '',
  recruiterEmail: '',
  cvUsed: '',
  coverLetterUsed: '',
  notes: '',
  followUpDate: '',
  applicationDeadline: '',
  jobPostingArchive: '',
  rejectionReason: '',
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: 'USD',
  applicationSource: '',
}

const toDateInputValue = (value) => {
  if (!value) return ''
  return value.slice(0, 10)
}

const normalizeInitialValues = (values) => ({
  ...emptyApplication,
  ...values,
  dateApplied: toDateInputValue(values.dateApplied),
  followUpDate: toDateInputValue(values.followUpDate),
  applicationDeadline: toDateInputValue(values.applicationDeadline),
})

function ApplicationForm({ initialValues = emptyApplication, submitLabel, onSubmit }) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: normalizeInitialValues(initialValues),
  })

  function cleanPayload(values) {
    return {
      ...values,
      companyName: values.companyName.trim(),
      jobTitle: values.jobTitle.trim(),
      location: values.location.trim(),
      applicationLink: values.applicationLink.trim(),
      recruiterName: values.recruiterName.trim(),
      recruiterEmail: values.recruiterEmail.trim(),
      cvUsed: values.cvUsed.trim(),
      coverLetterUsed: values.coverLetterUsed.trim(),
      notes: values.notes.trim(),
      jobPostingArchive: values.jobPostingArchive.trim(),
      rejectionReason: values.rejectionReason.trim(),
      salaryMin: values.salaryMin ? Number(values.salaryMin) : undefined,
      salaryMax: values.salaryMax ? Number(values.salaryMax) : undefined,
      salaryCurrency: values.salaryCurrency.trim() || 'USD',
      applicationSource: values.applicationSource,
      dateApplied: values.dateApplied || undefined,
      followUpDate: values.followUpDate || undefined,
      applicationDeadline: values.applicationDeadline || undefined,
    }
  }

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit((values) => onSubmit(cleanPayload(values)))}>
      <Input
        id="companyName"
        label="Company name"
        placeholder="BrightStack"
        error={errors.companyName?.message}
        {...register('companyName', { required: 'Company name is required' })}
      />
      <Input
        id="jobTitle"
        label="Job title"
        placeholder="Frontend Intern"
        error={errors.jobTitle?.message}
        {...register('jobTitle', { required: 'Job title is required' })}
      />
      <Select id="jobType" label="Job type" options={jobTypeOptions} {...register('jobType')} />
      <Input id="location" label="Location" placeholder="Remote, Lagos, Hybrid" {...register('location')} />
      <Input
        id="applicationLink"
        label="Application link"
        type="url"
        placeholder="https://company.com/careers"
        error={errors.applicationLink?.message}
        {...register('applicationLink', {
          pattern: {
            value: /^$|^https?:\/\/.+/i,
            message: 'Enter a valid URL',
          },
        })}
      />
      <Input id="dateApplied" label="Date applied" type="date" {...register('dateApplied')} />
      <Select id="status" label="Status" options={statusOptions} {...register('status')} />
      <Select id="applicationSource" label="Application source" options={applicationSourceOptions} {...register('applicationSource')} />
      <Input id="followUpDate" label="Follow-up date" type="date" {...register('followUpDate')} />
      <Input id="applicationDeadline" label="Application deadline" type="date" {...register('applicationDeadline')} />
      <Input id="recruiterName" label="Recruiter name" placeholder="Maya Chen" {...register('recruiterName')} />
      <Input
        id="recruiterEmail"
        label="Recruiter email"
        type="email"
        placeholder="recruiter@company.com"
        error={errors.recruiterEmail?.message}
        {...register('recruiterEmail', {
          pattern: {
            value: /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Enter a valid email',
          },
        })}
      />
      <Input id="cvUsed" label="CV used" placeholder="Frontend Resume v2.pdf" {...register('cvUsed')} />
      <Input
        id="salaryMin"
        label="Salary min"
        type="number"
        min="0"
        placeholder="50000"
        error={errors.salaryMin?.message}
        {...register('salaryMin', {
          min: { value: 0, message: 'Minimum salary must be 0 or more' },
        })}
      />
      <Input
        id="salaryMax"
        label="Salary max"
        type="number"
        min="0"
        placeholder="70000"
        error={errors.salaryMax?.message}
        {...register('salaryMax', {
          min: { value: 0, message: 'Maximum salary must be 0 or more' },
        })}
      />
      <Input id="salaryCurrency" label="Salary currency" placeholder="USD" {...register('salaryCurrency')} />
      <Input
        id="coverLetterUsed"
        label="Cover letter used"
        placeholder="Company Cover Letter.pdf"
        {...register('coverLetterUsed')}
      />
      <label className="block md:col-span-2" htmlFor="jobPostingArchive">
        <span className="mb-2 block text-sm font-medium text-slate-700">Job posting archive</span>
        <textarea
          id="jobPostingArchive"
          className="min-h-28 w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          placeholder="Paste the job description, requirements, or closing details before the posting disappears"
          {...register('jobPostingArchive')}
        />
      </label>
      <label className="block md:col-span-2" htmlFor="rejectionReason">
        <span className="mb-2 block text-sm font-medium text-slate-700">Rejection reason</span>
        <textarea
          id="rejectionReason"
          className="min-h-24 w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          placeholder="Save feedback or notes if this application is rejected"
          {...register('rejectionReason')}
        />
      </label>
      <label className="block md:col-span-2" htmlFor="notes">
        <span className="mb-2 block text-sm font-medium text-slate-700">Notes</span>
        <textarea
          id="notes"
          className="min-h-32 w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          placeholder="Add reminders, interview prep notes, or recruiter context"
          {...register('notes')}
        />
      </label>
      <div className="md:col-span-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}

export default ApplicationForm
