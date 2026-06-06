const key = 'dashboardPreferences'

export const defaultDashboardPreferences = {
  showStats: true,
  showReminders: true,
  showInterviews: true,
  showRecentApplications: true,
}

export function getDashboardPreferences() {
  const saved = localStorage.getItem(key)
  return saved ? { ...defaultDashboardPreferences, ...JSON.parse(saved) } : defaultDashboardPreferences
}

export function saveDashboardPreferences(preferences) {
  localStorage.setItem(key, JSON.stringify(preferences))
}

export function getOnboardingDismissed() {
  return localStorage.getItem('onboardingDismissed') === 'true'
}

export function dismissOnboarding() {
  localStorage.setItem('onboardingDismissed', 'true')
}
