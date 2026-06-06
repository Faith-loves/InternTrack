const APPLICATION_STATUS = {
  PENDING: 'pending',
  APPLIED: 'applied',
  ASSESSMENT: 'assessment',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  REJECTED: 'rejected',
  GHOSTED: 'ghosted',
}

const APPLICATION_STATUSES = Object.values(APPLICATION_STATUS)

module.exports = {
  APPLICATION_STATUS,
  APPLICATION_STATUSES,
}
