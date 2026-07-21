import { useQuery } from '@tanstack/react-query'
import { applicationService } from '../services/applicationService'
import { isDemoSession } from '../utils/authStorage'
import { demoApplications } from '../utils/demoData'

export function useApplications() {
  const isDemo = isDemoSession()

  return useQuery({
    queryKey: ['applications', isDemo ? 'demo' : 'live'],
    queryFn: async () => {
      if (isDemo) return demoApplications

      const { data } = await applicationService.getAll()
      return data
    },
  })
}
