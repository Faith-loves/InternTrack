import { APPLICATION_STATUSES, statusOptions, statusTones } from './statuses'

export { APPLICATION_STATUSES, statusOptions } from './statuses'

export const jobTypeOptions = [
  { value: 'internship', label: 'Internship' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'remote', label: 'Remote' },
]

export const applicationSourceOptions = [
  { value: '', label: 'Select source' },
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Indeed', label: 'Indeed' },
  { value: 'Company Website', label: 'Company Website' },
  { value: 'Referral', label: 'Referral' },
  { value: 'Handshake', label: 'Handshake' },
  { value: 'Email', label: 'Email' },
  { value: 'Other', label: 'Other' },
]

export const timelineStatuses = [
  APPLICATION_STATUSES.APPLIED,
  APPLICATION_STATUSES.ASSESSMENT,
  APPLICATION_STATUSES.INTERVIEW,
  APPLICATION_STATUSES.OFFER,
]

export function getStatusLabel(status) {
  return statusOptions.find((option) => option.value === status)?.label || status
}

export function getStatusTone(status) {
  return statusTones[status] || 'default'
}

export function getJobTypeLabel(jobType) {
  return jobTypeOptions.find((option) => option.value === jobType)?.label || jobType
}

export function isFollowUpDue(application) {
  if (
    !application.followUpDate ||
    [APPLICATION_STATUSES.OFFER, APPLICATION_STATUSES.REJECTED].includes(application.status)
  ) {
    return false
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const followUpDate = new Date(`${application.followUpDate}T00:00:00`)
  return followUpDate <= today
}

export function formatDate(date) {
  if (!date) return 'Not set'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatSalary(application) {
  const { salaryMin, salaryMax, salaryCurrency = 'USD' } = application
  if (!salaryMin && !salaryMax) return 'Not set'
  const formatter = new Intl.NumberFormat('en', {
    style: 'currency',
    currency: salaryCurrency || 'USD',
    maximumFractionDigits: 0,
  })

  if (salaryMin && salaryMax) return `${formatter.format(salaryMin)} - ${formatter.format(salaryMax)}`
  return formatter.format(salaryMin || salaryMax)
}

export function getPlainDate(date) {
  const plainDate = new Date(date)
  plainDate.setHours(0, 0, 0, 0)
  return plainDate
}

export function isToday(date) {
  if (!date) return false
  return getPlainDate(date).getTime() === getPlainDate(new Date()).getTime()
}

export function isThisWeek(date) {
  if (!date) return false
  const today = getPlainDate(new Date())
  const target = getPlainDate(date)
  const sevenDaysFromNow = new Date(today)
  sevenDaysFromNow.setDate(today.getDate() + 7)
  return target >= today && target <= sevenDaysFromNow
}
