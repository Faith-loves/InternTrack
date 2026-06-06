export const APPLICATION_STATUSES = {
  PENDING: 'pending',
  APPLIED: 'applied',
  ASSESSMENT: 'assessment',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  REJECTED: 'rejected',
  GHOSTED: 'ghosted',
}

export const statusOptions = [
  { value: APPLICATION_STATUSES.PENDING, label: 'Pending' },
  { value: APPLICATION_STATUSES.APPLIED, label: 'Applied' },
  { value: APPLICATION_STATUSES.ASSESSMENT, label: 'Assessment' },
  { value: APPLICATION_STATUSES.INTERVIEW, label: 'Interview' },
  { value: APPLICATION_STATUSES.OFFER, label: 'Offer' },
  { value: APPLICATION_STATUSES.REJECTED, label: 'Rejected' },
  { value: APPLICATION_STATUSES.GHOSTED, label: 'Ghosted' },
]

export const statusTones = {
  [APPLICATION_STATUSES.PENDING]: 'warning',
  [APPLICATION_STATUSES.APPLIED]: 'info',
  [APPLICATION_STATUSES.ASSESSMENT]: 'warning',
  [APPLICATION_STATUSES.INTERVIEW]: 'info',
  [APPLICATION_STATUSES.OFFER]: 'success',
  [APPLICATION_STATUSES.REJECTED]: 'danger',
  [APPLICATION_STATUSES.GHOSTED]: 'default',
}
